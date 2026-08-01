import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();
const controller = new ProductController();

router.get('/', (req, res) => controller.getProducts(req, res));
router.post('/', (req, res) => controller.createProduct(req, res));

export default router;