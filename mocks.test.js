import supertest from "supertest";
import { expect } from "chai";
import { app } from "./src/app.js";

const requester = supertest(app);

describe("Mock API Tests", () => {
  it("GET /api/mocks/users should generate the requested number of users", async () => {
    const response = await requester.get("/api/mocks/users?count=3");

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.lengthOf(3);
    expect(response.body.data[0]).to.include.all.keys(
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
    );
  });

  it("GET /api/mocks/users should reject an invalid count", async () => {
    const response = await requester.get("/api/mocks/users?count=0");

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_INPUT");
  });
});
