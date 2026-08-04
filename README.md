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
    # Puerto para el servidor
    PORT=8080

    # URI de conexión a MongoDB
    MONGO_URI=mongodb://localhost:27017/shipnow

    # Entorno de la aplicación (development o production)
    NODE_ENV=development
    ```

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
```

## ▶️ Scripts Disponibles

- **`npm start`**: Inicia el servidor en el puerto y entorno definidos en el archivo `.env`.

---

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

```
