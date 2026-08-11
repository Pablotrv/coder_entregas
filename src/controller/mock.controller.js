import { MockService } from "../services/mock.service.js";

const mockService = new MockService();

export class MockController {
  async getMockUsers(req, res) {
    const users = await mockService.generateUsers();
    return res.status(200).json({ status: "success", data: users });
  }

  async createMockUsers(req, res) {
    const insertedUsers = await mockService.createAndInsertUsers();
    return res.status(201).json({ status: "success", data: insertedUsers });
  }

  async getMockOrders(req, res) {
    const orders = await mockService.generateOrders();
    return res.status(200).json({ status: "success", data: orders });
  }

  async createMockOrders(req, res) {
    const insertedOrders = await mockService.createAndInsertOrders();
    return res.status(201).json({ status: "success", data: insertedOrders });
  }
}
