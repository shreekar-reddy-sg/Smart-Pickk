import express from "express";

const app = express();

app.use(express.json());

import shopRouter from "./routes/shop.route.js";
import productRouter from "./routes/product.route.js";
import authRouter from "./routes/auth.route.js";

app.use('/api/shops',shopRouter);
app.use('/api/products',productRouter);
app.use('/api/auth', authRouter);

export default app;