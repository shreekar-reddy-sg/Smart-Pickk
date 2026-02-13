import express from "express";

const app = express();

app.use(express.json());

import shopRouter from "./routes/shop.route.js";
import productRouter from "./routes/product.route.js";

app.use('/api/shops',shopRouter);
app.use('/api/products',productRouter);

export default app;