import { Router } from "express";
import { MockController } from "./../controllers/mock.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new MockController();

router.get("/users", asyncWrapper(controller.getMockUsers));
router.post("/users", asyncWrapper(controller.createMockUsers));
router.get("/orders", asyncWrapper(controller.getMockOrders));
router.post("/orders", asyncWrapper(controller.createMockOrders));

export default router;
