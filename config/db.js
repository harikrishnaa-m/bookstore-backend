const mongoose = require("mongoose");
const connectionString = process.env.MONGO_URI;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("sever is connected to db");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
