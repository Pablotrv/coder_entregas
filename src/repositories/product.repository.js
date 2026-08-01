import { ProductModel } from '../models/product.model.js';

export class ProductRepository {
  async findAll() {
    return await ProductModel.find();
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }
}
