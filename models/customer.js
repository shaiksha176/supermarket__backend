import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // Assuming profile picture is stored as a URL
  },
  phoneNumber: {
    type: String,
  },
  addresses: {
    type: [addressSchema], // Array of addresses
  },
});

export const Customer = mongoose.model("Customer", customerSchema);
