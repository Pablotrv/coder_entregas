import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export class ProductController {
  async getProducts(req, res) {
    const onlyInStock = req.query.inStock === "true";
    const products = await productService.getAllProducts(onlyInStock);
    return res.status(200).json({ status: "success", data: products });
  }

  async createProduct(req, res) {
    const newProduct = await productService.createProduct(req.body);
    return res.status(201).json({ status: "success", data: newProduct });
  }
}
