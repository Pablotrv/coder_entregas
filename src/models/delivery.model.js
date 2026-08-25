import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    personnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "delivered", "cancelled"],
      default: "assigned",
    },
  },
  { timestamps: true },
);

const DeliveryModel = mongoose.model("Delivery", deliverySchema);

export default DeliveryModel;
