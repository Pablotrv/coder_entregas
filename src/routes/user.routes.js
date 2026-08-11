import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     description: Retorna un listado de todos los usuarios registrados en la base de datos.
 *     responses:
 *       200:
 *         description: Listado de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  asyncWrapper((req, res) => controller.getUsers(req, res)),
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     description: Registra un nuevo usuario en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, delivery]
 *             example:
 *               firstName: "Jane"
 *               lastName: "Doe"
 *               email: "jane.doe@example.com"
 *               password: "password123"
 *               role: "user"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/",
  asyncWrapper((req, res) => controller.createUser(req, res)),
);

export default router;
