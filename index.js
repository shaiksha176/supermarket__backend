import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/products.js";
import errorMiddleware from "./middleware/error.js";
import customerRouter from "./routes/customer.js";
import orderRouter from "./routes/orders.js";
import categoryRouter from "./routes/category.js";
const app = express();
const PORT = process.env.PORT || 8000;
let pwd = "Nc0yEv0N5y1dy9lk";
const url = `mongodb+srv://johndoe:${pwd}@cluster0.0kurt.mongodb.net/supermarket`;
mongoose.connect(url, {
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

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
