export class AppError extends Error {
  constructor(options, legacyErrorCode, legacyStatusCode) {
    const normalizedOptions =
      typeof options === "string"
        ? {
            message: options,
            errorCode: legacyErrorCode,
            statusCode: legacyStatusCode,
          }
        : options;
    const {
      message,
      statusCode = 500,
      errorCode = "INTERNAL_SERVER_ERROR",
      details = null,
    } = normalizedOptions;
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
