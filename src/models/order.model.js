import mongoose from "mongoose";
import { ORDER_PRIORITY, ORDER_STATUS } from "../constants/index.js";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  priority: {
    type: String,
    enum: Object.values(ORDER_PRIORITY),
    default: ORDER_PRIORITY.MEDIUM,
  },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
