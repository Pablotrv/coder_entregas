import { UserService } from "../services/user.service.js";

const userService = new UserService();

export class UserController {
  async getUsers(req, res) {
    const users = await userService.getAllUsers();
    return res.status(200).json({ status: "success", data: users });
  }

  async createUser(req, res) {
    const newUser = await userService.createUser(req.body);
    return res.status(201).json({ status: "success", data: newUser });
  }
}
