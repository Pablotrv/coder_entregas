import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { app } from "./src/app.js";
import { config } from "./src/config/env.config.js";
import { ProductModel } from "./src/models/product.model.js";

const requester = supertest(app);

describe("Product API Tests", () => {
  // Connect to the database before running tests
  before(async function () {
    this.timeout(10000);
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
  });

  // Clean up the product collection before each test
  beforeEach(async () => {
    await ProductModel.deleteMany({});
  });

  // Disconnect after all tests are done
  after(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/products", () => {
    it("should return an empty array when no products exist", async () => {
      const response = await requester.get("/api/products");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.be.an("array").that.is.empty;
    });

    it("should return a list of products", async () => {
      // Arrange
      await ProductModel.create({
        name: "Test Product",
        price: 100,
        stock: 10,
        category: "Testing",
      });

      // Act
      const response = await requester.get("/api/products");

      // Assert
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array").with.lengthOf(1);
      expect(response.body.data[0].name).to.equal("Test Product");
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product successfully", async () => {
      const newProduct = {
        name: "Super Widget",
        price: 99.99,
        stock: 50,
        category: "Widgets",
      };

      const response = await requester.post("/api/products").send(newProduct);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.data.name).to.equal(newProduct.name);
      expect(response.body.data.price).to.equal(newProduct.price);
    });

    it("should return a 400 error for invalid input data", async () => {
      const invalidProduct = { name: "Incomplete Product" }; // Missing price, stock, category

      const response = await requester
        .post("/api/products")
        .send(invalidProduct);

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("INVALID_INPUT");
    });
  });
});
