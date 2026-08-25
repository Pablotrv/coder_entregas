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
  FILE_REQUIRED: {
    statusCode: 400,
    errorCode: "FILE_REQUIRED",
    message: "Debe enviar un archivo.",
  },
  FILE_TYPE_NOT_ALLOWED: {
    statusCode: 400,
    errorCode: "FILE_TYPE_NOT_ALLOWED",
    message: "Tipo de archivo no permitido.",
  },
  FILE_TOO_LARGE: {
    statusCode: 400,
    errorCode: "FILE_TOO_LARGE",
    message: "El archivo supera el tamaño máximo permitido.",
  },
  FILE_UPLOAD_ERROR: {
    statusCode: 400,
    errorCode: "FILE_UPLOAD_ERROR",
    message: "No se pudo procesar el archivo enviado.",
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
