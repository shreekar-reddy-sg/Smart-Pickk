import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/get", protect, getCart);

export default router;