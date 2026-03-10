import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;