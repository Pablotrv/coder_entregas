import swaggerJSDoc from "swagger-jsdoc";
import { config } from "./env.config.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API REST para la gestión de productos y usuarios de ShipNow, con documentación interactiva generada con Swagger.",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Servidor de Desarrollo",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID autogenerado por MongoDB.",
            },
            name: { type: "string", description: "Nombre del producto." },
            price: { type: "number", description: "Precio del producto." },
            stock: { type: "number", description: "Cantidad en stock." },
            category: {
              type: "string",
              description: "Categoría del producto.",
            },
            status: {
              type: "string",
              enum: ["available", "out_of_stock", "discontinued"],
              description: "Estado del producto.",
            },
          },
          example: {
            _id: "60d0fe4f5311236168a109ca",
            name: "Laptop Pro",
            price: 1200,
            stock: 50,
            category: "Electronics",
            status: "available",
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID autogenerado por MongoDB.",
            },
            firstName: { type: "string", description: "Nombre del usuario." },
            lastName: { type: "string", description: "Apellido del usuario." },
            email: {
              type: "string",
              description: "Correo electrónico del usuario.",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "delivery"],
              description: "Rol del usuario.",
            },
          },
          example: {
            _id: "60d0fe4f5311236168a109cb",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: "user",
          },
        },
        CreateUser: {
          type: "object",
          properties: {
            firstName: { type: "string", description: "Nombre del usuario." },
            lastName: { type: "string", description: "Apellido del usuario." },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico único del usuario.",
            },
            password: {
              type: "string",
              format: "password",
              description: "Contraseña del usuario (mínimo 8 caracteres).",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "delivery"],
              description: "Rol del usuario.",
              default: "user",
            },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
        CreateProduct: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre del producto." },
            price: { type: "number", description: "Precio del producto." },
            stock: { type: "number", description: "Cantidad en stock." },
            category: {
              type: "string",
              description: "Categoría del producto.",
            },
          },
          required: ["name", "price", "stock", "category"],
        },
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID autogenerado por MongoDB.",
            },
            user: {
              type: "string",
              description: "ID del usuario que realizó el pedido.",
            },
            delivery: {
              type: "string",
              description: "ID del repartidor asignado.",
            },
            products: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Arreglo de IDs de productos en el pedido.",
            },
            total: { type: "number", description: "Costo total del pedido." },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "in_progress",
                "delivered",
                "cancelled",
              ],
              description: "Estado actual del pedido.",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Prioridad del pedido.",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "Código de error interno de la aplicación.",
                },
                message: {
                  type: "string",
                  description: "Mensaje descriptivo del error.",
                },
                details: {
                  type: "object",
                  nullable: true,
                  description: "Detalles adicionales sobre el error.",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
