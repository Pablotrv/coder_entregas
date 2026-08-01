import express from "express";
import mongoose from "mongoose";
import { config } from "./config/env.config.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import mockRoutes from "./routes/mock.routes.js";

const app = express();

app.use(express.json());

// Registro de rutas
app.use("/api/mocks", mockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Conexión usando la configuración centralizada
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Conectado exitosamente a MongoDB");
    app.listen(config.port, () => {
      console.log(`Servidor ShipNow en puerto ${config.port} [${config.env}]`);
    });
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
