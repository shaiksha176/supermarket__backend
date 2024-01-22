import express from "express";
const router = express.Router();

// Sample in-memory database
const orders = [];

// Get all orders
router.get("/", (req, res, next) => {
  try {
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get a specific product by ID
router.get("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = orders.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create a new product
router.post("/", (req, res, next) => {
  try {
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
    };
    orders.push(newCustomer);

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
});

// Update a product by ID
router.put("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    const productIndex = orders.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = {
      id: productId,
      name: req.body.name,
      price: req.body.price,
      // other product properties...
    };

    orders[productIndex] = updatedProduct;

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a product by ID
router.delete("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    const productIndex = orders.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    orders.splice(productIndex, 1);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;