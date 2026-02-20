import mongoose, { Schema } from "mongoose";

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    photo: { type: String },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
