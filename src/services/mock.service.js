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

  generateUsers() {
    return generateUsers(50);
  }

  async createAndInsertUsers() {
    const users = generateUsers(50);
    const insertedUsers = await this.mockRepository.bulkCreateUsers(users);
    return insertedUsers;
  }

  async generateOrders() {
    const users = await this.userRepository.getUsers({ role: ROLES.USER });
    const deliveryPersonnel = await this.userRepository.getUsers({
      role: ROLES.DELIVERY,
    });
    const products = await this.productRepository.getProducts({});

    return generateOrders(20, users, deliveryPersonnel, products);
  }

  async createAndInsertOrders() {
    const users = await this.userRepository.getUsers({ role: ROLES.USER });
    const deliveryPersonnel = await this.userRepository.getUsers({
      role: ROLES.DELIVERY,
    });
    const products = await this.productRepository.getProducts({});

    const orders = generateOrders(20, users, deliveryPersonnel, products);
    const insertedOrders = await this.mockRepository.bulkCreateOrders(orders);
    return insertedOrders;
  }
}
