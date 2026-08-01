export const errorDictionary = {
  INVALID_INPUT: {
    statusCode: 400,
    errorCode: "INVALID_INPUT",
    message: "Datos de entrada inválidos.",
  },
  NOT_FOUND: {
    statusCode: 404,
    errorCode: "NOT_FOUND",
    message: "El recurso solicitado no existe.",
  },
  DATABASE_ERROR: {
    statusCode: 500,
    errorCode: "DATABASE_ERROR",
    message: "Ocurrió un error en la base de datos.",
  },
  MOCK_GENERATION_FAILED: {
    statusCode: 400,
    errorCode: "MOCK_GENERATION_FAILED",
    message: "No se pudo generar datos de prueba.",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    errorCode: "UNAUTHORIZED",
    message: "Acceso no autorizado.",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor.",
  },
};
