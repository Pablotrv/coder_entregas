import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true, trim: true },
    storedName: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 1 },
    documentType: { type: String, required: true, trim: true },
    entityType: {
      type: String,
      enum: ["user", "order", "delivery"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

fileSchema.index({ entityType: 1, entityId: 1 });

const FileModel = mongoose.model("File", fileSchema);

export default FileModel;
