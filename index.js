import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/products.js";
import errorMiddleware from "./middleware/error.js";
import customerRouter from "./routes/customer.js";
import orderRouter from "./routes/orders.js";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// API route middlewares go here
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/customer", customerRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
