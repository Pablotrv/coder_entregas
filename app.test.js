import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { app } from "./src/app.js";
import { ensureTestMongo } from "./src/config/testDb.config.js";
import { ProductModel } from "./src/models/product.model.js";

const requester = supertest(app);

describe("General App Tests", () => {
  before(async function () {
    this.timeout(20000);
    const mongoUri = await ensureTestMongo();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  after(async () => {
    await mongoose.connection.close();
  });
  describe("Swagger Endpoint", () => {
    it("GET /api/docs should redirect and return 200 OK", async () => {
      const response = await requester.get("/api/docs/");
      // Swagger UI responde con un 301 para redirigir a index.html, luego un 200.
      // Supertest maneja la redirección, por lo que verificamos el resultado final.
      expect(response.status).to.equal(200);
      expect(response.text).to.contain("<title>Swagger UI</title>");
    });
  });

  describe("Logger Test Endpoint", () => {
    it("GET /loggerTest should return a confirmation message", async () => {
      const response = await requester.get("/loggerTest");
      expect(response.status).to.equal(200);
      expect(response.text).to.equal(
        "Logs de prueba generados. Revisa la consola y/o el archivo de logs.",
      );
    });
  });

  describe("Health Check Endpoint", () => {
    it("GET /health should return API status", async () => {
      const response = await requester.get("/health");
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("ok");
      expect(response.body.service).to.equal("shipnow-api");
    });
  });

  describe("Paginated Product Listing", () => {
    it("GET /api/products should accept limit and page query params", async function () {
      this.timeout(10000);
      await ProductModel.deleteMany({});
      await ProductModel.insertMany([
        { name: "A", price: 10, stock: 2, category: "cat" },
        { name: "B", price: 20, stock: 3, category: "cat" },
        { name: "C", price: 30, stock: 4, category: "cat" },
      ]);

      const response = await requester.get("/api/products?limit=1&page=2");

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array");
      expect(response.body.pagination).to.deep.include({
        page: 2,
        limit: 1,
      });
    });
  });

  describe("Non-existent Route", () => {
    it("should return a 404 error with the correct format", async () => {
      const response = await requester.get("/api/non-existent-route-123");

      expect(response.status).to.equal(404);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("NOT_FOUND");
      expect(response.body.error.message).to.equal("Ruta no encontrada.");
    });
  });
});
