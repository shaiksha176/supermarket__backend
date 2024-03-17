import express from "express";
import { Customer } from "../models/customer.js";
const router = express.Router();

// Get all customers
router.get("/", async (req, res, next) => {
  try {
    const customer = await Customer.find();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve customer information." });
  }
});

// Create a new product
router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Create a new customer instance
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    // Save the new customer to the database
    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    next(error);
  }
});

// Update a product by ID
router.put("/:id", async (req, res, next) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    next(error);
  }
});

export default router;
