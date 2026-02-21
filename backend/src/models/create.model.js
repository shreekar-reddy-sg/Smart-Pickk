import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref : "User",
    required: true,
    unique: true,
  },
  products: [   
    {
      menuItem: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,       
      },
      quantity: {
        type: Number,       
        default: 1,
      },
    },
  ],
}
, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;