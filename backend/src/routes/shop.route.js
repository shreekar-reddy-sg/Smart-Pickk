import { Router } from "express";
import { createShop, fetchShops } from "../controllers/shop.controller.js";

const shopRouter = Router();

shopRouter.route('/shopCreate').post(createShop);
shopRouter.route('/fetchShops').get(fetchShops);

export default shopRouter;