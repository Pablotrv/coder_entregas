import supertest from "supertest";
import { expect } from "chai";
import { app } from "../src/app.js";

const requester = supertest(app);

describe("General App Tests", () => {
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
