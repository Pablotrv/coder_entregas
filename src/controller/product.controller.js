import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export class ProductController {
  async getProducts(req, res) {
    const onlyInStock = req.query.inStock === "true";
    const limit = Number.parseInt(req.query.limit ?? "10", 10);
    const page = Number.parseInt(req.query.page ?? "1", 10);

    const result = await productService.getAllProducts(onlyInStock, {
      limit,
      page,
    });

    return res.status(200).json({
      status: "success",
      data: result.products,
      pagination: result.pagination,
    });
  }

  async createProduct(req, res) {
    const newProduct = await productService.createProduct(req.body);
    return res.status(201).json({ status: "success", data: newProduct });
  }
}
