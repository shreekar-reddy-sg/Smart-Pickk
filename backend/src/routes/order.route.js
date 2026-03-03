import { Router } from 'express';
import { protect } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";
import { updateOrderStatus, getMyOrders } from '../controllers/order.controller.js';

const router = Router();

router.post("/checkout", protect, checkout); 
router.patch("/:orderId/status", protect, updateOrderStatus);  
router.get("/my-orders", protect, getMyOrders); 

export default router;