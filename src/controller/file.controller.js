import { FileService } from "../services/file.service.js";

const fileService = new FileService();

export class FileController {
  async upload(req, res) {
    const file = await fileService.createFile({
      entityType: req.uploadEntity.type,
      entityId: req.params.id,
      documentType: req.body.documentType,
      file: req.file,
    });
    return res.status(201).json({ status: "success", data: file });
  }

  async list(req, res) {
    const files = await fileService.findByEntity(
      req.uploadEntity.type,
      req.params.id,
    );
    return res.status(200).json({ status: "success", data: files });
  }
}