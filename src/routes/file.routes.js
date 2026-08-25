import { Router } from "express";
import { FileController } from "../controller/file.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";
import { uploadFile } from "../middlewares/upload.middleware.js";

const router = Router();
const controller = new FileController();

const entityRoutes = [
  { base: "users", type: "user", resource: "documents" },
  { base: "orders", type: "order", resource: "receipts" },
  { base: "deliveries", type: "delivery", resource: "documents" },
];

/**
 * @swagger
 * /api/users/{id}/documents:
 *   post:
 *     summary: Carga un documento de usuario
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUpload'
 *     responses:
 *       201:
 *         description: Documento cargado.
 *       400:
 *         description: Archivo ausente, tipo inválido o tamaño excedido.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Usuario no encontrado.
 */
/**
 * @swagger
 * /api/users/{id}/documents:
 *   get:
 *     summary: Lista documentos de usuario
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Documentos asociados.
 */

/**
 * @swagger
 * /api/orders/{id}/receipts:
 *   post:
 *     summary: Carga un comprobante de pedido
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUpload'
 *     responses:
 *       201: { description: Comprobante cargado. }
 *       400: { description: Archivo inválido. }
 *       404: { description: Pedido no encontrado. }
 */
/**
 * @swagger
 * /api/orders/{id}/receipts:
 *   get:
 *     summary: Lista comprobantes de pedido
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Comprobantes asociados. }
 */

/**
 * @swagger
 * /api/deliveries/{id}/documents:
 *   post:
 *     summary: Carga un documento de entrega
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUpload'
 *     responses:
 *       201: { description: Documento cargado. }
 *       400: { description: Archivo inválido. }
 *       404: { description: Entrega no encontrada. }
 */
/**
 * @swagger
 * /api/deliveries/{id}/documents:
 *   get:
 *     summary: Lista documentos de entrega
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Documentos asociados. }
 */

for (const route of entityRoutes) {
  const routePath = `/api/${route.base}/:id/${route.resource}`;
  router.post(
    routePath,
    uploadFile(route.type),
    asyncWrapper((req, res) => controller.upload(req, res)),
  );
  router.get(
    routePath,
    (req, res, next) => {
      req.uploadEntity = { type: route.type };
      next();
    },
    asyncWrapper((req, res) => controller.list(req, res)),
  );
}

export default router;
