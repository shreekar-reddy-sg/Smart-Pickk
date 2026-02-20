import express from "express";

const app = express();

app.use(express.json());

import shopRouter from "./routes/shop.route.js";
import productRouter from "./routes/product.route.js";
import authRouter from "./routes/auth.route.js";
import menuItemRouter from "./routes/menuitem.route.js";

app.use('/api/shops',shopRouter);
app.use('/api/products',productRouter);
app.use('/api/auth', authRouter);
app.use('/api/menuItem', menuItemRouter);

export default app;