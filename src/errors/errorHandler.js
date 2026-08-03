import { AppError } from "./AppError.js";
import { errorDictionary } from "./errorDictionary.js";
import { logger } from "../config/logger.config.js";

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isAppError = err instanceof AppError;

  if (isAppError) {
    // Errores de negocio o esperados: se registran como advertencia.
    logger.warning(`[${err.errorCode}] ${err.message}`, {
      details: err.details,
    });
  } else {
    // Errores inesperados del servidor: se registran como error.
    logger.error(`[INTERNAL_SERVER_ERROR] ${err.message}`, {
      stack: err.stack,
    });
  }

  const statusCode = isAppError
    ? err.statusCode
    : errorDictionary.INTERNAL_SERVER_ERROR.statusCode;
  const errorCode = isAppError
    ? err.errorCode
    : errorDictionary.INTERNAL_SERVER_ERROR.errorCode;
  const message = isAppError ? err.message : "Error interno del servidor.";
  const details = isAppError ? err.details : null;

  return res.status(statusCode).json({
    status: "error",
    error: {
      code: errorCode,
      message,
      details,
    },
  });
};
