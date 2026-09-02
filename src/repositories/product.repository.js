import { ProductModel } from "../models/product.model.js";

export class ProductRepository {
  async count(filters = {}) {
    return ProductModel.countDocuments(filters);
  }

  async findAll(filters = {}, options = {}) {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;

    return ProductModel.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }
}
