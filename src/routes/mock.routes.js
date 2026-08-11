import { Router } from "express";
import { MockController } from "../controller/mock.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new MockController();

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: Endpoints para generación de datos de prueba.
 */

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Genera un listado de usuarios de prueba
 *     tags: [Mocks]
 *     description: Devuelve un listado de 50 usuarios generados al azar sin guardarlos en la base de datos.
 *     responses:
 *       200:
 *         description: Listado de usuarios de prueba.
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
 */
router.get("/users", asyncWrapper(controller.getMockUsers));

/**
 * @swagger
 * /api/mocks/users:
 *   post:
 *     summary: Crea e inserta usuarios de prueba en la BD
 *     tags: [Mocks]
 *     description: Crea 50 usuarios de prueba y los inserta en la base de datos.
 *     responses:
 *       201:
 *         description: Usuarios creados e insertados exitosamente.
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
 */
router.post("/users", asyncWrapper(controller.createMockUsers));

/**
 * @swagger
 * /api/mocks/orders:
 *   get:
 *     summary: Genera un listado de pedidos de prueba
 *     tags: [Mocks]
 *     description: Devuelve un listado de 20 pedidos generados al azar sin guardarlos en la base de datos. Requiere que existan usuarios y productos en la BD para obtener referencias.
 *     responses:
 *       200:
 *         description: Listado de pedidos de prueba.
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
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error si no hay suficientes usuarios o productos para generar los pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/orders", asyncWrapper(controller.getMockOrders));

/**
 * @swagger
 * /api/mocks/orders:
 *   post:
 *     summary: Crea e inserta pedidos de prueba en la BD
 *     tags: [Mocks]
 *     description: Crea 20 pedidos de prueba y los inserta en la base de datos. Requiere que existan usuarios y productos previamente.
 *     responses:
 *       201:
 *         description: Pedidos creados e insertados exitosamente.
 *       400:
 *         description: Error si no hay suficientes usuarios o productos para generar los pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/orders", asyncWrapper(controller.createMockOrders));

export default router;
