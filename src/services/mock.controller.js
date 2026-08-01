import { MockService } from "../services/mock.service.js";

export class MockController {
  constructor() {
    this.service = new MockService();
  }

  getMockUsers = (req, res) => {
    try {
      const users = this.service.generateUsers();
      res.status(200).json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  createMockUsers = async (req, res) => {
    try {
      const users = await this.service.createAndInsertUsers();
      res.status(201).json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  getMockOrders = async (req, res) => {
    try {
      const orders = await this.service.generateOrders();
      res.status(200).json({ status: "success", payload: orders });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  createMockOrders = async (req, res) => {
    try {
      const orders = await this.service.createAndInsertOrders();
      res.status(201).json({ status: "success", payload: orders });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
}
