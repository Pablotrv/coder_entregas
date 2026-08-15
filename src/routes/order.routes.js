import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints para la gestión de pedidos y entregas.
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Orders]
 *     description: Crea un pedido, valida el stock de productos y actualiza las cantidades.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que realiza el pedido.
 *                 example: "60d0fe4f5311236168a109ca"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Datos inválidos o stock insuficiente.
 *       404:
 *         description: Usuario o producto no encontrado.
 */
router.post(
  "/",
  asyncWrapper((req, res) => controller.createOrder(req, res)),
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtiene un pedido por su ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalles del pedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       404:
 *         description: Pedido no encontrado.
 */
router.get(
  "/:id",
  asyncWrapper((req, res) => controller.getOrderById(req, res)),
);

/**
 * @swagger
 * /api/orders/{id}/assign-delivery:
 *   patch:
 *     summary: Asigna un repartidor a un pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AssignDelivery' }
 *     responses:
 *       200:
 *         description: Repartidor asignado y pedido actualizado a 'enviado'.
 */
router.patch(
  "/:id/assign-delivery",
  asyncWrapper((req, res) => controller.assignDelivery(req, res)),
);

export default router;
