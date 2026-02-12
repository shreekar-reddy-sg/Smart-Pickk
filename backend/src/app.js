import express from "express";

const app = express();

app.use(express.json());

import router from "./routes/shop.route.js";

app.use('/api/shops/',router);

export default app;