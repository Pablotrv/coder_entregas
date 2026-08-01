# 🚀 ShipNow API - Refactorización por Capas

API REST para la gestión de productos y usuarios de **ShipNow**, refactorizada desde un modelo monolítico hacia una arquitectura profesional de 3 capas (**Controller - Service - Repository**), orientada a la mantenibilidad, escalabilidad y robustez.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** con **Mongoose**
- **dotenv** (Gestión de variables de entorno)

---

## 📂 Arquitectura del Proyecto

El código está estructurado bajo el principio de separación de responsabilidades:

````text
src/
├── config/         # Configuración centralizada y validación de entorno
├── constants/      # Constantes inmutables (roles, estados de productos)
├── controllers/    # Manejo de peticiones HTTP (req/res)
├── models/         # Esquemas de Mongoose
├── repositories/   # Consultas directas a la base de datos (Data Access Layer)
├── routes/         # Definición de endpoints de Express
├── services/       # Lógica de negocio
└── app.js          # Punto de entrada de la aplicación

## 🧪 Endpoints de Mocking
Se ha incorporado un módulo de mocking para generar datos de prueba. Para usarlo, primero instala la dependencia de Faker si aún no lo has hecho:

```bash
npm install @faker-js/faker
````

Endpoints disponibles:

- `GET /api/mocks/users`: devuelve un listado de 50 usuarios generados al azar (sin guardarlos en la base de datos).
- `POST /api/mocks/users`: crea 50 usuarios de prueba y los inserta en la base de datos.
- `GET /api/mocks/orders`: devuelve un listado de 20 pedidos generados al azar (sin guardarlos en la base de datos).
- `POST /api/mocks/orders`: crea 20 pedidos de prueba y los inserta en la base de datos. Requiere que existan usuarios y productos previamente.

> Nota: los endpoints `POST` son ideales para poblar tu base de datos de desarrollo con datos realistas para realizar pruebas.

## 🧨 Manejo centralizado de errores

El proyecto ahora utiliza errores personalizados y un middleware global para respuestas consistentes.

- Todos los errores esperados se lanzan como `AppError`.
- El middleware `src/errors/errorHandler.js` devuelve respuestas con la estructura:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo",
    "details": null
  }
}
```

- Errores de rutas no existentes devuelven `404 NOT_FOUND`.
- Errores de validación de mocks devuelven `400 INVALID_INPUT` o `400 MOCK_GENERATION_FAILED` cuando los datos de entrada son incorrectos o faltan usuarios/productos.

## ⚠️ Casos inválidos del módulo de mocks

- `generateUsers(count)` valida que `count` sea un entero positivo.
- `generateOrders(count, users, deliveryPersonnel, products)` valida que `count` sea un entero positivo y que `users` y `products` sean arreglos válidos.
- Si no hay usuarios o productos disponibles, se lanza un error con código `MOCK_GENERATION_FAILED`.

Con esta estructura, la API responde errores de forma centralizada y coherente con la arquitectura de capas.

```

```
