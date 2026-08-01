import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  async getProducts(req, res) {
    try {
      const onlyInStock = req.query.inStock === 'true';
      const products = await productService.getAllProducts(onlyInStock);
      return res.status(200).json({ status: 'success', data: products });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      return res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
