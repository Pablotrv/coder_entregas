import { OrderService } from "../services/order.service.js";

export class OrderController {
  constructor() {
    this.service = new OrderService();
  }

  async createOrder(req, res) {
    const { userId, items } = req.body;
    const order = await this.service.createOrder(userId, items);
    res.status(201).json({ status: "success", data: order });
  }

  async getOrderById(req, res) {
    const { id } = req.params;
    const order = await this.service.getOrderById(id);
    res.status(200).json({ status: "success", data: order });
  }

  async assignDelivery(req, res) {
    const { id } = req.params;
    const { deliveryPersonnelId } = req.body;
    const updatedOrder = await this.service.assignDelivery(
      id,
      deliveryPersonnelId,
    );
    res.status(200).json({ status: "success", data: updatedOrder });
  }
}
