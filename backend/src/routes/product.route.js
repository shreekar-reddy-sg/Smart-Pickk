import { Router } from "express";
import { createProduct, fetchProducts } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.route('/').post(createProduct);
productRouter.route('/:shopId').get(fetchProducts);

export default productRouter;