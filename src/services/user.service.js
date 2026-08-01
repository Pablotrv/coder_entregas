import { UserRepository } from '../repositories/user.repository.js';

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async createUser(userData) {
    return await userRepository.create(userData);
  }
}
