//import mongoose
const mongoose = require("mongoose");

//create schema using  new mongoose.Schema({})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "Bookstore User",
  },
});

module.exports = mongoose.model("users", userSchema);
