import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import shopRouter from "./routes/shop.route.js";
import productRouter from "./routes/product.route.js";
import authRouter from "./routes/auth.route.js";
import menuItemRouter from "./routes/menuitem.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import errorhandler from "./middleware/error.middleware.js";

app.use('/api/shops',shopRouter);
app.use(errorhandler);
app.use('/api/products',productRouter);
app.use('/api/auth', authRouter);
app.use('/api/menuItem', menuItemRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

export default app;