import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { config } from "dotenv";
import AWS from "aws-sdk";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/products.js";
import errorMiddleware from "./middleware/error.js";
import customerRouter from "./routes/customer.js";
import orderRouter from "./routes/orders.js";
import categoryRouter from "./routes/category.js";

const app = express();
const PORT = process.env.PORT || 8000;
config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.AWS_REGION,
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection is successful
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API route middlewares go here
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/customer", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);

// error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
