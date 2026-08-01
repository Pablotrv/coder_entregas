import { AppError } from "./AppError.js";
import { errorDictionary } from "./errorDictionary.js";

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isAppError = err instanceof AppError;
  const { statusCode, errorCode, message, details } = isAppError
    ? err
    : {
        statusCode: errorDictionary.INTERNAL_SERVER_ERROR.statusCode,
        errorCode: errorDictionary.INTERNAL_SERVER_ERROR.errorCode,
        message: err.message || errorDictionary.INTERNAL_SERVER_ERROR.message,
        details: err.details || null,
      };

  return res.status(statusCode).json({
    status: "error",
    error: {
      code: errorCode,
      message,
      details,
    },
  });
};
