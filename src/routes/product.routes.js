import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { asyncWrapper } from "../errors/asyncWrapper.js";

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para la gestión de productos.
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     description: Retorna un listado de todos los productos. Permite filtrar por productos en stock.
 *     parameters:
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filtrar para obtener solo productos con stock disponible.
 *     responses:
 *       200:
 *         description: Listado de productos.
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  asyncWrapper((req, res) => controller.getProducts(req, res)),
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     description: Crea un nuevo producto en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *             example:
 *               name: "Teclado Mecánico RGB"
 *               price: 85.50
 *               stock: 120
 *               category: "Periféricos"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/",
  asyncWrapper((req, res) => controller.createProduct(req, res)),
);

export default router;
