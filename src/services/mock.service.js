import { ROLES } from "../domain.js";
import { MockRepository } from "../repositories/mock.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { generateOrders, generateUsers } from "../models/mocks.generator.js";

export class MockService {
  constructor() {
    this.mockRepository = new MockRepository();
    // Repositorios reales para obtener datos existentes
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
  }

  generateUsers(count = 50) {
    return generateUsers(count);
  }

  async createAndInsertUsers(count = 50) {
    const users = generateUsers(count);
    const insertedUsers = await this.mockRepository.bulkCreateUsers(users);
    return insertedUsers;
  }

  async generateOrders(count = 20) {
    const users = await this.userRepository.getUsers({ role: ROLES.USER });
    const deliveryPersonnel = await this.userRepository.getUsers({
      role: ROLES.DELIVERY,
    });
    const products = await this.productRepository.getProducts({});

    return generateOrders(count, users, deliveryPersonnel, products);
  }

  async createAndInsertOrders(count = 20) {
    const users = await this.userRepository.getUsers({ role: ROLES.USER });
    const deliveryPersonnel = await this.userRepository.getUsers({
      role: ROLES.DELIVERY,
    });
    const products = await this.productRepository.getProducts({});

    const orders = generateOrders(count, users, deliveryPersonnel, products);
    const insertedOrders = await this.mockRepository.bulkCreateOrders(orders);
    return insertedOrders;
  }
}
