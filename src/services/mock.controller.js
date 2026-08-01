import { MockService } from "../services/mock.service.js";

export class MockController {
  constructor() {
    this.service = new MockService();
  }

  getMockUsers = async (req, res) => {
    const users = await this.service.generateUsers();
    res.status(200).json({ status: "success", data: users });
  };

  createMockUsers = async (req, res) => {
    const users = await this.service.createAndInsertUsers();
    res.status(201).json({ status: "success", data: users });
  };

  getMockOrders = async (req, res) => {
    const orders = await this.service.generateOrders();
    res.status(200).json({ status: "success", data: orders });
  };

  createMockOrders = async (req, res) => {
    const orders = await this.service.createAndInsertOrders();
    res.status(201).json({ status: "success", data: orders });
  };
}
