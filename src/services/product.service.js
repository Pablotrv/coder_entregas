import { ProductRepository } from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const productRepository = new ProductRepository();

export class ProductService {
  async getAllProducts(onlyInStock = false) {
    const products = await productRepository.findAll();
    
    if (onlyInStock) {
      return products.filter(
        (p) => p.stock > 0 && p.status === PRODUCT_STATUS.AVAILABLE
      );
    }
    return products;
  }

  async createProduct(productData) {
    if (productData.stock <= 0) {
      productData.status = PRODUCT_STATUS.OUT_OF_STOCK;
    }
    return await productRepository.create(productData);
  }
}
