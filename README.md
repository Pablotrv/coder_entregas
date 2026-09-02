# ShipNow API

API REST para gestionar usuarios, productos, pedidos y archivos asociados a una entrega. El repositorio incluye arquitectura por capas, validaciones, errores centralizados, logging con Winston, Swagger, pruebas funcionales y ejecución con Docker.

## Tecnologías

Node.js 20, Express, MongoDB/Mongoose, Mocha, Chai, Supertest, MongoDB Memory Server, Multer, Winston y Swagger UI.

## Arquitectura

Las rutas solo registran endpoints y delegan en `Controller -> Service -> Repository`. Los controllers traducen HTTP, los services concentran las reglas de negocio y los repositories/models encapsulan el acceso a MongoDB. La configuración vive en `src/config` y los errores se normalizan mediante `src/errors/errorHandler.js`.

## Variables de entorno

Copia `.env.example` como `.env` y ajusta los valores:

| Variable        | Uso                                  | Valor recomendado                   |
| --------------- | ------------------------------------ | ----------------------------------- |
| `PORT`          | Puerto HTTP                          | `8080`                              |
| `NODE_ENV`      | `development`, `test` o `production` | `development`                       |
| `MONGODB_URI`   | URI de MongoDB                       | `mongodb://localhost:27017/shipnow` |
| `UPLOAD_DIR`    | Directorio de archivos               | `./uploads`                         |
| `MAX_FILE_SIZE` | Tamaño máximo en bytes               | `5242880`                           |

No se versionan `.env`, `logs/`, `uploads/`, coverage ni `node_modules`.

## Instalación y ejecución local

```bash
npm install
npm start
```

La API queda disponible en `http://localhost:8080`. MongoDB debe estar disponible según `MONGODB_URI`.

## Tests

```bash
npm test
```

La suite usa MongoDB Memory Server y una conexión separada para el entorno `test`; no utiliza la base local configurada para desarrollo.

## Swagger

Documentación interactiva: `http://localhost:8080/api/docs`.

Incluye schemas de `User`, `Order`, `Product`, `FileMetadata`, `ErrorResponse` y respuestas exitosas. Los endpoints documentados coinciden con las rutas de la aplicación.

## Endpoints principales

- `GET/POST /api/products`: listado paginado y creación de productos.
- `GET/POST /api/users`: listado y creación de usuarios.
- `POST /api/orders`: creación de pedidos con validación de stock.
- `GET /api/orders/:id`: detalle de un pedido.
- `PATCH /api/orders/:id/assign-delivery`: asignación y tracking de entrega.
- `GET/POST /api/mocks/users` y `GET/POST /api/mocks/orders`: generación de mocks.
- `POST/GET /api/users/:id/documents`: documentos de usuarios.
- `POST/GET /api/orders/:id/receipts`: comprobantes de pedidos.
- `POST/GET /api/deliveries/:id/documents`: documentos de entregas.
- `GET /health`: health check.
- `GET /loggerTest`: prueba de niveles de logging.

Las respuestas de error usan siempre `{ status: "error", error: { code, message, details } }`. Se controlan recursos inexistentes, datos inválidos, estados inválidos, cantidad inválida de mocks y errores de archivos (`FILE_REQUIRED`, `FILE_TYPE_NOT_ALLOWED`, `FILE_TOO_LARGE`).

## Archivos y logging

Multer acepta PDF, JPG, PNG y WEBP, con límite configurable. Los binarios se guardan bajo `UPLOAD_DIR` y sus metadatos en MongoDB. En producción se escriben `logs/combined.log` y `logs/error.log`; la consola se habilita únicamente en desarrollo y los logs no se suben al repositorio.

## Docker Compose

Para levantar API y MongoDB con persistencia y esperar a que MongoDB esté saludable:

```bash
docker compose up --build
```

La API se publica en `http://localhost:8080`; Compose configura `MONGODB_URI=mongodb://mongo:27017/shipnow` y usa un healthcheck de Mongo antes de iniciar la API. Los volúmenes `mongo-data`, `uploads-data` y `logs-data` son administrados por Docker.

También puedes construir y ejecutar solo la imagen:

```bash
docker build -t shipnow-api .
docker run --rm -p 8080:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/shipnow \
  shipnow-api
```

El `Dockerfile` es multi-stage, instala únicamente dependencias de producción y contiene un healthcheck HTTP para `/health`.
