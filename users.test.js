import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { app } from "../src/app.js";
import { config } from "../src/config/env.config.js";
import UserModel from "../src/models/user.model.js";

const requester = supertest(app);

describe("User API Tests", () => {
  // Connect to the database before running tests
  before(async function () {
    this.timeout(10000); // Increase timeout for DB connection
    await mongoose.connect(config.mongoUri);
  });

  // Clean up the user collection before each test
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  // Disconnect after all tests are done
  after(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/users", () => {
    it("should return an empty array when no users exist", async () => {
      const response = await requester.get("/api/users");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.be.an("array").that.is.empty;
    });

    it("should return a list of users", async () => {
      // Arrange: Create a test user
      await UserModel.create({
        firstName: "Test",
        lastName: "User",
        email: "test.user@example.com",
        password: "password123",
      });

      // Act
      const response = await requester.get("/api/users");

      // Assert
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.be.an("array").with.lengthOf(1);
      expect(response.body.data[0].email).to.equal("test.user@example.com");
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user successfully", async () => {
      const newUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "a.secure.password",
        role: "user",
      };

      const response = await requester.post("/api/users").send(newUser);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.include.keys(
        "firstName",
        "lastName",
        "email",
        "role",
      );
      expect(response.body.data.email).to.equal(newUser.email);
      expect(response.body.data).to.not.have.property("password"); // Ensure password is not returned
    });

    it("should return a 400 error if email already exists", async () => {
      // Arrange: Create a user first
      const existingUser = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "password123",
      };
      await UserModel.create(existingUser);

      // Act: Try to create another user with the same email
      const response = await requester.post("/api/users").send(existingUser);

      // Assert
      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("INVALID_INPUT");
      expect(response.body.error.message).to.contain("El email ya está en uso");
    });
  });
});
