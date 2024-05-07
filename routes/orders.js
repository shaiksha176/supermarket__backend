// Import necessary modules and setup Express Router
import express from "express";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { Customer } from "../models/customer.js";

const router = express.Router();

// Create an order for a customer
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount, status, address, paymentDetails } =
      req.body;

    // Basic validation
    if (!customer || !items || !totalAmount) {
      return res
        .status(400)
        .json({ error: "Please provide all required order details." });
    }

    // Create a new order
    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      address,
      paymentDetails,
    });

    // // Mongoose validation
    try {
      await newOrder.validate();
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Save the order to the database
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating the order" });
  }
});

// Route to get a list of all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.product", // Populate the 'product' field in 'items'
        model: Product, // Reference the Product model
        select: "-description -manufacturer -__v", // Exclude description and manufacturer
      })
      .populate({
        path: "customer", // Correct path is "customer," not "Customer"
        model: "Customer",
        select: "-password -addresses -__v", // Exclude sensitive information like the password
      })
      .select("-paymentDetails -address -__v"); // Exclude the paymentDetails field from the main order document

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders." });
  }
});

// Route to get a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve the order." });
  }
});

// Route to update an order by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update the order." });
  }
});

// Route to delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the order." });
  }
});

// DELETE route to delete all orders based on customer ID
router.delete("/customer/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Assuming your 'Order' model has a field named 'customer' representing the customer ID
    await Order.deleteMany({ customer: customerId });

    res.status(200).json({ message: "Orders deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete orders" });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Find all orders where the customer ID matches
    const orders = await Order.find({ customer: customerId }).populate(
      "items.product",
    );

    if (orders.length === 0) {
      // If no orders found for the customer ID
      return res
        .status(404)
        .json({ message: "No orders found for the customer ID" });
    }

    // If orders found, return them
    res.json(orders);
  } catch (error) {
    // If an error occurs during database query
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export the router
export default router;
