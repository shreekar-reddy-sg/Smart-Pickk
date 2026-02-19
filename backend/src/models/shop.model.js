import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema(
  {
    shopName: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
      trim: true
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Geo index
shopSchema.index({ location: "2dsphere" });

export const Shop = mongoose.model("Shop", shopSchema);