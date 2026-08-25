import FileModel from "../models/file.model.js";

export class FileRepository {
  async create(fileData) {
    return await FileModel.create(fileData);
  }

  async findByEntity(entityType, entityId) {
    return await FileModel.find({ entityType, entityId }).sort({
      createdAt: -1,
    });
  }

  async deleteById(id) {
    return await FileModel.findByIdAndDelete(id);
  }
}
