import { randomUUID } from "crypto";
import { OrderRepository } from "../repositories/order.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { ORDER_STATUS } from "../../order.constants.js";

export class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrder(userId, items) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", ERROR_CODES.NOT_FOUND, 404);
    }

    let totalPrice = 0;
    const productsToUpdate = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new AppError(
          `Producto con ID ${item.productId} no encontrado`,
          ERROR_CODES.NOT_FOUND,
          404,
        );
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          `Stock insuficiente para el producto: ${product.name}`,
          ERROR_CODES.INVALID_INPUT,
          400,
        );
      }

      totalPrice += product.price * item.quantity;
      product.stock -= item.quantity;
      productsToUpdate.push(product.save());
    }

    // Actualizar el stock de todos los productos en paralelo
    await Promise.all(productsToUpdate);

    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      user: userId,
      products: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      totalPrice,
      status: ORDER_STATUS.PENDING,
    };

    return this.orderRepository.create(orderData);
  }

  async assignDelivery(orderId, deliveryPersonnelId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Pedido no encontrado", ERROR_CODES.NOT_FOUND, 404);
    }

    const deliveryPersonnel =
      await this.userRepository.findById(deliveryPersonnelId);
    if (!deliveryPersonnel || deliveryPersonnel.role !== "delivery") {
      throw new AppError(
        "Personal de entrega no válido",
        ERROR_CODES.INVALID_INPUT,
        400,
      );
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3); // Estimación de 3 días

    order.delivery = {
      personnel: deliveryPersonnelId,
      trackingNumber: randomUUID(),
      estimatedDeliveryDate,
    };
    order.status = ORDER_STATUS.SHIPPED;

    return this.orderRepository.update(orderId, order);
  }

  async getOrderById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new AppError("Pedido no encontrado", ERROR_CODES.NOT_FOUND, 404);
    }
    return order;
  }
}
