import { Router } from "express";
import { createShop, fetchShops, getNearbyShops, getMyShops } from "../controllers/shop.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const shopRouter = Router();

shopRouter.post('/shopCreate',protect,createShop);
shopRouter.route('/fetchShops').get(fetchShops);
shopRouter.route('/nearbyShops').get(getNearbyShops);
shopRouter.get('/getMyShops',protect,getMyShops);


export default shopRouter;