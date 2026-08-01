import { Router } from "express";
import { MockController } from "../controllers/mock.controller.js";

const router = Router();
const controller = new MockController();

router.get("/users", controller.getMockUsers);
router.post("/users", controller.createMockUsers);
router.get("/orders", controller.getMockOrders);
router.post("/orders", controller.createMockOrders);

export default router;
