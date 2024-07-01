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
import fs from 'fs'

const app = express();
const PORT = process.env.PORT || 8000;
config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.AWS_REGION,
});


let  s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// const params = {
//   Bucket: process.env.BUCKET_NAME,
//   Prefix: 'fruits/' // Specify the folder name here, leave empty to list all objects in the bucket
// };
// // Call S3 to list the buckets
// s3.listObjects(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

// const fileContent = fs.readFileSync('uploads/image-1715505138805.jpg');

// // Define S3 upload parameters
// const params = {
//   Bucket: process.env.BUCKET_NAME,
//   Key: 'fruits/image2.jpg', // Specify the folder name and file name
//   Body: fileContent
// };

// // Upload the image to S3
// s3.upload(params, function(err, data) {
//   if (err) {
//     console.log('Error uploading image:', err);
//   } else {
//     console.log('Image uploaded successfully. S3 location:', data.Location);
//   }
// });

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
