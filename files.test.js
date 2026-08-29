import fs from "fs/promises";
import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { app } from "./src/app.js";
import { config } from "./src/config/env.config.js";
import { ensureTestMongo } from "./src/config/testDb.config.js";
import UserModel from "./src/models/user.model.js";
import OrderModel from "./src/models/order.model.js";
import FileModel from "./src/models/file.model.js";

const requester = supertest(app);
const uploadRoot = config.uploadDir;

const attachPdf = (request, name = "document.pdf", content = "%PDF-test") =>
  request.attach("file", Buffer.from(content), {
    filename: name,
    contentType: "application/pdf",
  });

describe("File Upload API Tests", () => {
  let testUser;
  let testOrder;

  before(async function () {
    this.timeout(20000);
    const mongoUri = await ensureTestMongo();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await FileModel.deleteMany({});
    await OrderModel.deleteMany({});
    await UserModel.deleteMany({});

    testUser = await UserModel.create({
      firstName: "File",
      lastName: "User",
      email: "file.user@example.com",
      password: "password123",
    });
    testOrder = await OrderModel.create({
      orderNumber: `FILE-${Date.now()}`,
      user: testUser._id,
      products: [],
      totalPrice: 0,
    });
  });

  after(async () => {
    await FileModel.deleteMany({});
    await fs.rm(uploadRoot, { recursive: true, force: true });
    await mongoose.connection.close();
  });

  it("should upload a user document and persist its metadata", async () => {
    const response = await attachPdf(
      requester
        .post(`/api/users/${testUser._id}/documents`)
        .field("documentType", "identity"),
    );

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.data.originalName).to.equal("document.pdf");
    expect(response.body.data.entityType).to.equal("user");
    expect(response.body.data.entityId).to.equal(testUser._id.toString());

    const savedFile = await FileModel.findById(response.body.data._id);
    expect(savedFile).to.exist;
    expect(savedFile.documentType).to.equal("identity");
  });

  it("should list files associated with a user", async () => {
    await attachPdf(
      requester
        .post(`/api/users/${testUser._id}/documents`)
        .field("documentType", "identity"),
    );

    const response = await requester.get(
      `/api/users/${testUser._id}/documents`,
    );

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.lengthOf(1);
  });

  it("should upload a receipt associated with an order", async () => {
    const response = await attachPdf(
      requester
        .post(`/api/orders/${testOrder._id}/receipts`)
        .field("documentType", "payment_receipt"),
      "receipt.pdf",
    );

    expect(response.status).to.equal(201);
    expect(response.body.data.entityType).to.equal("order");
    expect(response.body.data.documentType).to.equal("payment_receipt");
  });

  it("should reject a request without a file using the centralized error format", async () => {
    const response = await requester
      .post(`/api/users/${testUser._id}/documents`)
      .field("documentType", "identity");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error.code).to.equal("FILE_REQUIRED");
  });

  it("should reject unsupported file types", async () => {
    const response = await requester
      .post(`/api/users/${testUser._id}/documents`)
      .field("documentType", "identity")
      .attach("file", Buffer.from("not allowed"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("FILE_TYPE_NOT_ALLOWED");
  });

  it("should reject files larger than the configured limit", async () => {
    const response = await requester
      .post(`/api/users/${testUser._id}/documents`)
      .field("documentType", "identity")
      .attach("file", Buffer.alloc(config.maxFileSize + 1), {
        filename: "large.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("FILE_TOO_LARGE");
  });

  it("should reject a missing document type and remove the uploaded file", async () => {
    const response = await attachPdf(
      requester.post(`/api/users/${testUser._id}/documents`),
    );

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_INPUT");
    expect(await FileModel.countDocuments({})).to.equal(0);
  });

  it("should reject an unknown associated entity", async () => {
    const missingId = new mongoose.Types.ObjectId();
    const response = await attachPdf(
      requester
        .post(`/api/users/${missingId}/documents`)
        .field("documentType", "identity"),
    );

    expect(response.status).to.equal(404);
    expect(response.body.error.code).to.equal("NOT_FOUND");
  });
});
