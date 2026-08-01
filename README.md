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

```text
src/
├── config/         # Configuración centralizada y validación de entorno
├── constants/      # Constantes inmutables (roles, estados de productos)
├── controllers/    # Manejo de peticiones HTTP (req/res)
├── models/         # Esquemas de Mongoose
├── repositories/   # Consultas directas a la base de datos (Data Access Layer)
├── routes/         # Definición de endpoints de Express
├── services/       # Lógica de negocio
└── app.js          # Punto de entrada de la aplicación
├── services/       # Lógica de negocio
└── app.js          # Punto de entrada de la aplicación

+--- + +## 🧪 Endpoints de Mocking + +Se ha incorporado un módulo de mocking para generar datos de prueba. Para usarlo, primero instala la dependencia de Faker si aún no lo has hecho: + +bash +npm install @faker-js/faker + + +Luego, puedes usar los siguientes endpoints: + +- GET /api/mocks/users: Devuelve un listado de 50 usuarios generados al azar (sin guardarlos en la base de datos). + +- POST /api/mocks/users: Crea 50 usuarios de prueba y los inserta en la base de datos. + +- GET /api/mocks/orders: Devuelve un listado de 20 pedidos generados al azar (sin guardarlos en la base de datos). + +- POST /api/mocks/orders: Crea 20 pedidos de prueba y los inserta en la base de datos. Requiere que existan usuarios y productos previamente. + +> Nota: Los endpoints POST son ideales para poblar tu base de datos de desarrollo con datos realistas para realizar pruebas.


Con esta actualización, la documentación del proyecto está al día con las últimas funcionalidades.

<!--
[PROMPT_SUGGESTION]Implementa un middleware de manejo de errores para centralizar y simplificar el código en los controladores.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Agrega paginación a los endpoints que devuelven listados, como `GET /api/products` y `GET /api/users`.[/PROMPT_SUGGESTION]
-->

```
