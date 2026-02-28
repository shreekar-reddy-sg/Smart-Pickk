import { Router } from 'express';
import { protect } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";

const router = Router();

router.post("/checkout", protect, checkout);    

export default router;