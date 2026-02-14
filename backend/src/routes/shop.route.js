import { Router } from "express";
import { createShop, fetchShops, getNearbyShops } from "../controllers/shop.controller.js";

const shopRouter = Router();

shopRouter.route('/shopCreate').post(createShop);
shopRouter.route('/fetchShops').get(fetchShops);
shopRouter.route('/nearbyShops').get(getNearbyShops);

export default shopRouter;