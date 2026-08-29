import { ProductRepository } from "../repositories/product.repository.js";
import { PRODUCT_STATUS } from "../domain.js";
import { AppError } from "../errors/AppError.js";

const productRepository = new ProductRepository();

export class ProductService {
  async getAllProducts(onlyInStock = false) {
    const products = await productRepository.findAll();

    if (onlyInStock) {
      return products.filter(
        (p) => p.stock > 0 && p.status === PRODUCT_STATUS.AVAILABLE,
      );
    }
    return products;
  }

  async createProduct(productData) {
    try {
      if (!productData) {
        throw new AppError({
          statusCode: 400,
          errorCode: "INVALID_INPUT",
          message: "Datos de entrada inválidos.",
        });
      }

      if (productData.stock <= 0) {
        productData.status = PRODUCT_STATUS.OUT_OF_STOCK;
      }

      return await productRepository.create(productData);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.name === "ValidationError" || error?.name === "CastError") {
        throw new AppError({
          statusCode: 400,
          errorCode: "INVALID_INPUT",
          message: "Datos de entrada inválidos.",
          details: error.message,
        });
      }

      throw error;
    }
  }
}
