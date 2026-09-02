# 🚀 ShipNow API - Refactorización por Capas

API REST para la gestión de productos y usuarios de **ShipNow**. Este proyecto ha sido refactorizado desde un modelo monolítico hacia una arquitectura profesional por capas (**Controller - Service - Repository**), incorporando un sistema de logging avanzado con Winston y un manejo de errores centralizado.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** y **Mongoose**
- **Winston** y **winston-daily-rotate-file** para logging profesional.
- **dotenv** para la gestión de variables de entorno.
- **@faker-js/faker** para la generación de datos de prueba.
- **Multer** para la carga de documentos y comprobantes.

---

## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_PROYECTO>
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    ```env
    # Configuración del servidor
    PORT=8080
    NODE_ENV=development

    # Configuración de la base de datos MongoDB (ej. Atlas o local)
    MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/shipnow?retryWrites=true&w=majority"

    # Configuración de archivos (opcional)
    UPLOAD_DIR="./uploads"
    MAX_FILE_SIZE=5242880
    ```

    > **Nota importante**: La aplicación valida la presencia de `PORT`, `NODE_ENV` y `MONGODB_URI` al arrancar. Si alguna de estas variables no está definida en el entorno o en el archivo `.env`, el servidor no se iniciará y mostrará un error fatal. Esto garantiza un comportamiento predecible y evita fallos en tiempo de ejecución por falta de configuración.

---

## 📂 Arquitectura del Proyecto

El código está estructurado bajo el principio de separación de responsabilidades:

```text
src/
├── config/         # Configuración (entorno, logger)
├── constants/      # Constantes inmutables (roles, estados de productos)
├── controllers/    # Manejo de peticiones HTTP (req/res)
├── models/         # Esquemas de Mongoose
├── repositories/   # Consultas directas a la base de datos (Data Access Layer)
├── routes/         # Definición de endpoints de Express
├── services/       # Lógica de negocio
└── app.js          # Punto de entrada de la aplicación
```

## ▶️ Scripts Disponibles

- **`npm start`**: Inicia el servidor en el puerto y entorno definidos en el archivo `.env`.
- **`npm test`**: Ejecuta la suite funcional con MongoDB en memoria.

---

## 🚀 Performance, escalabilidad y entorno de producción

Se aplicaron varias buenas prácticas para un entorno más cercano a producción:

- Listados paginados con `limit` y `page` en `GET /api/products`.
- Máximo de 100 elementos por página para evitar respuestas enormes.
- Límite de payload HTTP de `1 MB` para evitar abuso de memoria.
- Desactivación de `x-powered-by` para reducir exposición de información.
- Variables de entorno centralizadas con validación del puerto, entorno y MongoDB.
- Health check en `GET /health` para integración con Docker, orchestrators y monitoreo.

### Endpoint de salud

```bash
curl http://localhost:8080/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "shipnow-api",
  "environment": "production",
  "timestamp": "2026-09-01T12:00:00.000Z"
}
```

---

## 🧪 Ejecución de Pruebas

El proyecto incluye una suite de tests funcionales automatizados con Mocha, Chai y Supertest. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

---

## � Docker

Se incluye un `Dockerfile` y un `.dockerignore` para ejecutar la API en contenedores.

### Construir la imagen

```bash
docker build -t shipnow-api .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name shipnow-api \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/shipnow?retryWrites=true&w=majority" \
  shipnow-api
```

El contenedor expone el puerto `8080` y ejecuta un health check cada 30 segundos sobre `http://localhost:8080/health`.

---

## �📦 Gestión de Pedidos y Entregas

El sistema incluye endpoints para la creación de pedidos y la asignación de entregas.

### Endpoints de Pedidos

- **`POST /api/orders`**: Crea un nuevo pedido.
  - Recibe el `userId` y un arreglo de `items` (con `productId` y `quantity`).
  - Valida que el usuario y los productos existan.
  - Verifica que haya stock suficiente para cada producto y lo descuenta.
  - Calcula el precio total y crea el pedido en estado `pending`.
- **`GET /api/orders/:id`**: Obtiene los detalles de un pedido específico.
- **`PATCH /api/orders/:id/assign-delivery`**: Asigna un repartidor a un pedido.
  - Cambia el estado del pedido a `shipped`.
  - Genera un número de seguimiento y una fecha estimada de entrega.

## � Documentación de la API con Swagger

Este proyecto utiliza **Swagger** para generar documentación interactiva de la API, permitiendo a los desarrolladores explorar y probar los endpoints fácilmente.

### Acceso a la Documentación

Una vez que el servidor esté en funcionamiento, puedes acceder a la interfaz de Swagger UI desde tu navegador en la siguiente URL:

**`http://localhost:8080/api/docs`**

### ¿Qué está documentado?

- **Endpoints**: Todos los endpoints principales de `Users`, `Products` y `Mocks`, incluyendo métodos, parámetros, cuerpos de solicitud y respuestas esperadas (tanto exitosas como de error).
- **Schemas**: Se han definido schemas reutilizables para las entidades principales (`User`, `Product`, `Order`) y para la estructura de respuesta de errores.
- **Logger**: Se incluye un endpoint de prueba (`/loggerTest`) para verificar la configuración del logger.

## 🧪 Endpoints de Mocking

Se ha incorporado un módulo de mocking para generar datos de prueba realistas.

Endpoints disponibles:

- `GET /api/mocks/users`: devuelve un listado de 50 usuarios generados al azar (sin guardarlos en la base de datos).
- `POST /api/mocks/users`: crea 50 usuarios de prueba y los inserta en la base de datos.
- `GET /api/mocks/orders`: devuelve un listado de 20 pedidos generados al azar (sin guardarlos en la base de datos).
- `POST /api/mocks/orders`: crea 20 pedidos de prueba y los inserta en la base de datos. Requiere que existan usuarios y productos previamente.

> Nota: los endpoints `POST` son ideales para poblar tu base de datos de desarrollo con datos realistas para realizar pruebas.

---

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

---

## 🪵 Logging Profesional con Winston

El proyecto integra `winston` para un manejo de logs robusto y configurable según el entorno.

### Niveles de Log

Se han definido los siguientes niveles de log, en orden de severidad (de menor a mayor): `debug`, `http`, `info`, `warning`, `error`, `fatal`.

### Comportamiento por Entorno

#### Entorno de Desarrollo (`development`)

- **Nivel mínimo**: `debug`. Se mostrarán todos los logs.
- **Transporte**: Consola, con formato simple y colores para una fácil lectura.

#### Entorno de Producción (`production`)

- **Nivel mínimo**: `info`. Solo se mostrarán logs de `info` o superiores.
- **Transportes**:
  1.  **Consola**: Muestra logs de `info` en adelante con un formato simple.
  2.  **Archivo Rotativo**: Guarda logs de nivel `error` y `fatal` en archivos dentro de la carpeta `logs/`.
      - **Nombre del archivo**: `error-YYYY-MM-DD.log`.
      - **Rotación**: Diaria.
      - **Retención**: Los logs se guardan por 14 días (`14d`).
      - **Formato**: JSON, para facilitar el análisis por sistemas automatizados.

> La carpeta `logs/` está incluida en el `.gitignore` para evitar que los archivos de log sean versionados en el repositorio.

### Endpoint de Prueba del Logger

Para verificar que todos los niveles de log funcionan correctamente en el entorno actual, se ha habilitado un endpoint de prueba.

- **Endpoint**: `GET /loggerTest`
- **Acción**: Al acceder a esta ruta, la aplicación generará un log de ejemplo para cada uno de los niveles definidos (`debug`, `http`, `info`, `warning`, `error`, `fatal`).
- **Uso**:

  ```bash
  # Puedes usar curl
  curl http://localhost:8080/loggerTest

  # O simplemente abrir la URL en tu navegador
  http://localhost:8080/loggerTest
  ```

  Revisa la consola y, si estás en producción, la carpeta `logs/` para ver los resultados.

```

## Carga de documentos y comprobantes

La API acepta archivos `PDF`, `JPG`, `PNG` y `WEBP` de hasta 5 MB por defecto. Los binarios se guardan en `uploads/<entidad>/<id>` y sus metadatos se registran en MongoDB. El directorio puede cambiarse con `UPLOAD_DIR` y el límite con `MAX_FILE_SIZE`.

Todos los endpoints usan `multipart/form-data` con los campos `file` y `documentType`.

- `POST /api/users/:id/documents` y `GET /api/users/:id/documents`
- `POST /api/orders/:id/receipts` y `GET /api/orders/:id/receipts`
- `POST /api/deliveries/:id/documents` y `GET /api/deliveries/:id/documents`

Los errores de carga respetan el formato centralizado y pueden informar `FILE_REQUIRED`, `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE` o `FILE_UPLOAD_ERROR`.

```
