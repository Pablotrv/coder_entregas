import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({ status: 'success', data: users });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      return res.status(201).json({ status: 'success', data: newUser });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}
