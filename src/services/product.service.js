import { ProductRepository } from "../repositories/product.repository.js";
import { PRODUCT_STATUS } from "../domain.js";
import { AppError } from "../errors/AppError.js";

const productRepository = new ProductRepository();

export class ProductService {
  async getAllProducts(onlyInStock = false, pagination = {}) {
    const limit =
      Number.isInteger(pagination.limit) && pagination.limit > 0
        ? Math.min(pagination.limit, 100)
        : 10;
    const page =
      Number.isInteger(pagination.page) && pagination.page > 0
        ? pagination.page
        : 1;

    const filters = onlyInStock
      ? { stock: { $gt: 0 }, status: PRODUCT_STATUS.AVAILABLE }
      : {};

    const total = await productRepository.count(filters);
    const products = await productRepository.findAll(filters, { limit, page });
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
    const safePage = Math.min(page, totalPages);

    return {
      products,
      pagination: {
        total,
        page: safePage,
        limit,
        totalPages,
        hasNextPage: safePage < totalPages,
      },
    };
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
