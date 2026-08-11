import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new ProductController();

router.get(
  "/",
  asyncWrapper((req, res) => controller.getProducts(req, res)),
);
router.post(
  "/",
  asyncWrapper((req, res) => controller.createProduct(req, res)),
);

export default router;
