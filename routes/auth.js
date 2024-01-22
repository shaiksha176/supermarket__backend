import express from "express";

const router = express.Router();

router.post("/login", (req, res, next) => {
  res.send("logged in");
});

router.post("/register", (req, res, next) => {
  res.send("successfully registered");
});

export default router;
