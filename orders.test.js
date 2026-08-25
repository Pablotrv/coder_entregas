import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { app } from "./src/app.js";
import { config } from "./src/config/env.config.js";
import UserModel from "./src/models/user.model.js";
import { ProductModel } from "./src/models/product.model.js";
import OrderModel from "./src/models/order.model.js";

const requester = supertest(app);

describe("Order API Tests", () => {
  let testUser;
  let testProduct;

  before(async function () {
    this.timeout(10000);
    await mongoose.connect(config.mongoUri);
  });

  // Limpiar colecciones y crear datos base antes de cada test
  beforeEach(async () => {
    await OrderModel.deleteMany({});
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});

    testUser = await UserModel.create({
      firstName: "Order",
      lastName: "User",
      email: "order.user@example.com",
      password: "password123",
    });

    testProduct = await ProductModel.create({
      name: "Order Product",
      price: 50,
      stock: 20,
      category: "Orders",
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/orders", () => {
    it("should create an order successfully", async () => {
      const orderPayload = {
        userId: testUser._id.toString(),
        items: [{ productId: testProduct._id.toString(), quantity: 2 }],
      };

      const response = await requester.post("/api/orders").send(orderPayload);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.data.totalPrice).to.equal(100); // 50 * 2
      expect(response.body.data.user).to.equal(testUser._id.toString());

      // Verificar que el stock del producto se haya reducido
      const updatedProduct = await ProductModel.findById(testProduct._id);
      expect(updatedProduct.stock).to.equal(18); // 20 - 2
    });

    it("should return a 400 error if stock is insufficient", async () => {
      const orderPayload = {
        userId: testUser._id.toString(),
        items: [{ productId: testProduct._id.toString(), quantity: 25 }], // Pide más del stock disponible
      };

      const response = await requester.post("/api/orders").send(orderPayload);

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("INVALID_INPUT");
      expect(response.body.error.message).to.contain("Stock insuficiente");
    });

    it("should return a 404 error if product does not exist", async () => {
      const nonExistentProductId = new mongoose.Types.ObjectId();
      const orderPayload = {
        userId: testUser._id.toString(),
        items: [{ productId: nonExistentProductId.toString(), quantity: 1 }],
      };

      const response = await requester.post("/api/orders").send(orderPayload);

      expect(response.status).to.equal(404);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("NOT_FOUND");
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should get an order by its ID", async () => {
      // Arrange: Crear una orden primero
      const newOrder = await OrderModel.create({
        orderNumber: "ORD-123",
        user: testUser._id,
        products: [{ product: testProduct._id, quantity: 1 }],
        totalPrice: 50,
      });

      // Act
      const response = await requester.get(`/api/orders/${newOrder._id}`);

      // Assert
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.data.orderNumber).to.equal("ORD-123");
      expect(response.body.data.user._id.toString()).to.equal(
        testUser._id.toString(),
      );
    });

    it("should return 404 for a non-existent order ID", async () => {
      const nonExistentOrderId = new mongoose.Types.ObjectId();
      const response = await requester.get(`/api/orders/${nonExistentOrderId}`);

      expect(response.status).to.equal(404);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("NOT_FOUND");
    });
  });
});
