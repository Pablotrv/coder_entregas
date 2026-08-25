import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import { config } from "../config/env.config.js";
import { AppError } from "../errors/AppError.js";

const allowedFiles = new Map([
  ["application/pdf", ".pdf"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const safePathPart = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const entityType = safePathPart(req.uploadEntity?.type);
    const entityId = safePathPart(req.params.id);
    const destination = path.resolve(config.uploadDir, entityType, entityId);

    fs.mkdir(destination, { recursive: true }, (error) =>
      callback(error, destination),
    );
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const expectedExtension = allowedFiles.get(file.mimetype);
  const extension = path.extname(file.originalname).toLowerCase();

  if (!expectedExtension || expectedExtension !== extension) {
    return callback(
      new AppError({
        statusCode: 400,
        errorCode: "FILE_TYPE_NOT_ALLOWED",
        message: "Tipo de archivo no permitido. Use PDF, JPG, PNG o WEBP.",
      }),
    );
  }

  return callback(null, true);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize, files: 1 },
});

const multerErrorToAppError = (error) => {
  if (error instanceof AppError) return error;
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return new AppError({
      statusCode: 400,
      errorCode: "FILE_TOO_LARGE",
      message: `El archivo supera el tamaño máximo de ${config.maxFileSize / 1024 / 1024} MB.`,
    });
  }
  if (error instanceof multer.MulterError) {
    return new AppError({
      statusCode: 400,
      errorCode: "FILE_UPLOAD_ERROR",
      message: "No se pudo procesar el archivo enviado.",
      details: { reason: error.code },
    });
  }
  return error;
};

export const uploadFile = (entityType) => (req, res, next) => {
  req.uploadEntity = { type: entityType };
  uploader.single("file")(req, res, (error) => {
    if (error) return next(multerErrorToAppError(error));
    if (!req.file) {
      return next(
        new AppError({
          statusCode: 400,
          errorCode: "FILE_REQUIRED",
          message: "Debe enviar un archivo en el campo file.",
        }),
      );
    }
    return next();
  });
};
