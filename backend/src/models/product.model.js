import mongoose,{ Schema } from "mongoose";

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 100,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);