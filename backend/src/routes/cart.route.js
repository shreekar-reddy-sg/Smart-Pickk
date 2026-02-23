import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", protect, addToCart);

export default router;