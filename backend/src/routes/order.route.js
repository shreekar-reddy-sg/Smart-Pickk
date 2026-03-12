import { Router } from 'express';
import { protect } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";
import { updateOrderStatus, getMyOrders, getAllOrders, analytics, dailyAnalytics, bestSellingItems } from '../controllers/order.controller.js';

const router = Router();

router.post("/checkout", protect, checkout); 
router.patch("/:orderId/status", protect, updateOrderStatus);  
router.get("/all-orders", protect, getAllOrders);
router.get("/my-orders", protect, getMyOrders); 
router.get("/analytics-advanced", protect, analytics);
router.get("/daily-sales", protect, dailyAnalytics);
router.get("/analytics/best-selling", protect, bestSellingItems);

export default router;