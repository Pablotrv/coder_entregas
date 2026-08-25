import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { config } from "../config/env.config.js";
import { logger } from "../config/logger.config.js";
import { AppError } from "../errors/AppError.js";
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";
import DeliveryModel from "../models/delivery.model.js";
import { FileRepository } from "../repositories/file.repository.js";

const entityModels = {
  user: UserModel,
  order: OrderModel,
  delivery: DeliveryModel,
};
const fileRepository = new FileRepository();

export class FileService {
  async createFile({ entityType, entityId, documentType, file }) {
    try {
      const entity = await this.findEntity(entityType, entityId);
      if (!entity) {
        throw new AppError({
          statusCode: 404,
          errorCode: "NOT_FOUND",
          message: "La entidad asociada no existe.",
        });
      }

      if (!documentType || !documentType.trim()) {
        throw new AppError({
          statusCode: 400,
          errorCode: "INVALID_INPUT",
          message: "El campo documentType es requerido.",
        });
      }

      const metadata = await fileRepository.create({
        originalName: file.originalname,
        storedName: file.filename,
        path: path.relative(process.cwd(), file.path).replaceAll("\\", "/"),
        mimeType: file.mimetype,
        size: file.size,
        documentType: documentType.trim(),
        entityType,
        entityId,
      });

      logger.info(
        `Archivo cargado para ${entityType}/${entityId}: ${file.originalname}`,
      );
      return metadata;
    } catch (error) {
      await fs.rm(file.path, { force: true }).catch(() => undefined);
      throw error;
    }
  }

  async findByEntity(entityType, entityId) {
    const entity = await this.findEntity(entityType, entityId);
    if (!entity) {
      throw new AppError({
        statusCode: 404,
        errorCode: "NOT_FOUND",
        message: "La entidad asociada no existe.",
      });
    }
    return await fileRepository.findByEntity(entityType, entityId);
  }

  async findEntity(entityType, entityId) {
    const Model = entityModels[entityType];
    if (!Model || !mongoose.isValidObjectId(entityId)) {
      throw new AppError({
        statusCode: 400,
        errorCode: "INVALID_INPUT",
        message: "La entidad o el identificador no son válidos.",
      });
    }
    return await Model.findById(entityId);
  }
}
