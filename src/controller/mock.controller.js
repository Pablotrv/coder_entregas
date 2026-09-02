import { MockService } from "../services/mock.service.js";

const mockService = new MockService();

export class MockController {
  async getMockUsers(req, res) {
    const count = req.query.count === undefined ? 50 : Number(req.query.count);
    const users = await mockService.generateUsers(count);
    return res.status(200).json({ status: "success", data: users });
  }

  async createMockUsers(req, res) {
    const count = req.query.count === undefined ? 50 : Number(req.query.count);
    const insertedUsers = await mockService.createAndInsertUsers(count);
    return res.status(201).json({ status: "success", data: insertedUsers });
  }

  async getMockOrders(req, res) {
    const count = req.query.count === undefined ? 20 : Number(req.query.count);
    const orders = await mockService.generateOrders(count);
    return res.status(200).json({ status: "success", data: orders });
  }

  async createMockOrders(req, res) {
    const count = req.query.count === undefined ? 20 : Number(req.query.count);
    const insertedOrders = await mockService.createAndInsertOrders(count);
    return res.status(201).json({ status: "success", data: insertedOrders });
  }
}
