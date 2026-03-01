import { Router } from 'express';
import { protect } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";
import { updateOrderStatus } from '../controllers/orderStatusUpdate.controller.js';

const router = Router();

router.post("/checkout", protect, checkout); 
router.patch("/:orderId/status", protect, updateOrderStatus);   

export default router;