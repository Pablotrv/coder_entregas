import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/env.config.js";
import { logger } from "./config/logger.config.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import mockRoutes from "./routes/mock.routes.js";
import fileRoutes from "./routes/file.routes.js";
import { errorHandler } from "./errors/errorHandler.js";
import { swaggerSpecs } from "./config/swagger.config.js";

export const app = express(); // Export the app

// Middleware para loggear requests
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Ruta para la documentación de Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Registro de rutas
app.use("/api/mocks", mockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(fileRoutes);

/**
 * @swagger
 * /loggerTest:
 *   get:
 *     summary: Prueba los niveles de logging
 *     description: Genera un log de ejemplo para cada nivel de severidad (debug, http, info, warning, error, fatal) para verificar la configuración actual de Winston.
 *     tags:
 *       - Logger
 *     responses:
 *       200:
 *         description: Mensaje de confirmación. Los logs se muestran en la consola y/o archivos de log según el entorno.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Logs de prueba generados. Revisa la consola y/o el archivo de logs.
 */
// Endpoint de prueba del logger
app.get("/loggerTest", (req, res) => {
  logger.debug("Este es un log de debug.");
  logger.http("Este es un log de http.");
  logger.info("Este es un log de info.");
  logger.warning("Este es un log de warning.");
  logger.error("Este es un log de error.");
  logger.fatal("Este es un log de fatal.");
  res.send(
    "Logs de prueba generados. Revisa la consola y/o el archivo de logs.",
  );
});

app.use((req, res) => {
  logger.warning(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: "error",
    error: {
      code: "NOT_FOUND",
      message: "Ruta no encontrada.",
      details: null,
    },
  });
});

app.use(errorHandler);

// Conexión usando la configuración centralizada.
// En entorno de pruebas no se conecta a MongoDB local ni se levanta el servidor;
// los tests usan una base en memoria y supertest sobre la app exportada.
if (config.mongoUri && process.env.NODE_ENV !== "test") {
  mongoose
    .connect(config.mongoUri)
    .then(() => {
      logger.info("Conectado exitosamente a MongoDB");
      app.listen(config.port, () => {
        logger.info(
          `Servidor ShipNow en puerto ${config.port} [${config.env}]`,
        );
      });
    })
    .catch((err) => logger.fatal("Error fatal al conectar a MongoDB:", err));
} else if (process.env.NODE_ENV === "test") {
  logger.info(
    "Entorno de pruebas activo: se omite la conexión a MongoDB local.",
  );
}
