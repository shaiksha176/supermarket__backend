import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { Product } from "../models/product.js";
import path from "path";
const router = express.Router();
import fs from 'fs'
import cloudinary from "cloudinary";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Create a folder named 'uploads' in your project directory
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage });

cloudinary.v2.config({
  cloud_name: "dtrhefg4l",
  api_key: "433636122121656",
  api_secret: "G1ehRfCTV7F6qOAZTAKZeuBSRWE",
  secure: true,
});

// const upload = multer({
//   storage: multer.memoryStorage(),
// });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" })
// Get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().populate("category")
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// Create a new product
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      quantityInStock,
      manufacturer,
    } = req.body;

    console.log(req.file);

    // const params = {
    //   Bucket: process.env.BUCKET_NAME,
    //   Key: `fruits/${Date.now()}-${req.file.originalname}`,
    //   Body: req.file.buffer,
    //   ContentType: req.file.mimetype,
    //   // ACL: "public-read", // Adjust permissions as needed
    // };

    // const fileContent = fs.readFileSync('uploads/' +  req.file.fieldname + "-" + Date.now() + path.extname(req.file.originalname));
// const fileContent = fs.readFileSync('uploads/image-1715505138805.jpg');

    // const params = {
    //   Bucket: process.env.BUCKET_NAME,
    //   Key: `fruits/fruit1.jpg`,
    //   Body:fileContent,
    //   // Body: req.file.buffer,
    //   // ContentType: req.file.mimetype,
    //   // ACL: "public-read", // Adjust permissions as needed
    // };


    // const uploadImageToS3 = new Promise((resolve, reject) => {
    //   s3.upload(params, (error, data) => {
    //     if (error) {
    //       console.log(error);
    //       reject({
    //         success: false,
    //         message: "Error uploading to S3",
    //       });
    //     } else {
    //       resolve({
    //         success: true,
    //         message: "File uploaded successfully to S3!",
    //         image_url: data.Location,
    //       });
    //     }
    //   });
    // });
    const imagePath = req.file.path;

    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "supermarket-images",
    });
    console.log("Result ", result);

    // // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      quantityInStock,
      manufacturer,
      imageURL:result.secure_url
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
    // res.sendStatus("OK")
  } catch (error) {
    next(error);
  }
});

// Update a product by ID
router.put("/:id", async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    next(error);
  }
});

// Route to get products based on category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find products that belong to the specified category
    const products = await Product.find({ category: categoryId });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve products by category." });
  }
});

export default router;
