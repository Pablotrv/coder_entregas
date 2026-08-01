import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();
const controller = new UserController();

router.get('/', (req, res) => controller.getUsers(req, res));
router.post('/', (req, res) => controller.createUser(req, res));

export default router;