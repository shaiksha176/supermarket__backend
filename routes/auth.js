import express from "express";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }

    // Find the customer by email
    const existingCustomer = await Customer.findOne({ email });
    console.log("existingCustomer: ", existingCustomer);
    if (!existingCustomer) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check the password
    if (existingCustomer.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { customerId: existingCustomer._id },
      "your-secret-key",
      { expiresIn: "1h" },
    );

    // Send the token in the response
    res
      .status(200)
      .json({ success: true, message: "Successfully logged in", token });
  } catch (error) {}
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // Check if the email or username already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { username }],
    });

    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, error: "Email or username already exists" });
    }

    const newCustomer = new Customer({
      username,
      email,
      password,
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Successfully registered",
      customer: savedCustomer,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

export default router;
