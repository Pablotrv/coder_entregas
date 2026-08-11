import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new UserController();

router.get(
  "/",
  asyncWrapper((req, res) => controller.getUsers(req, res)),
);
router.post(
  "/",
  asyncWrapper((req, res) => controller.createUser(req, res)),
);

export default router;
