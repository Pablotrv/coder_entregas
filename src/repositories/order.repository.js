import OrderModel from "../models/order.model.js";

export class OrderRepository {
  async create(orderData) {
    return OrderModel.create(orderData);
  }

  async findById(id) {
    return OrderModel.findById(id)
      .populate("user")
      .populate("products.product");
  }

  async findAll(filters = {}) {
    return OrderModel.find(filters)
      .populate("user")
      .populate("products.product");
  }

  async update(id, updateData) {
    return OrderModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}
