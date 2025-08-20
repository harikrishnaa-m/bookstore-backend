//import dotenv file
require("dotenv").config();
//import express
const express = require("express");
//import cors
const cors = require("cors");
//import appMiddleware
const appMiddleware = require("./middlewares/appMiddleware");
const bookServer = express();
PORT = process.env.PORT || 3000; //by default 3000 or we can define the port so for that we define using or
//import db and router
const route = require("./routes/route");
const db = require("./config/db");
//implement cors
bookServer.use(cors());
bookServer.use(express.json()); //middleware
bookServer.use(appMiddleware); //use before route
bookServer.use(route);
//to convert uploaded mages to link
bookServer.use("/upload", express.static("./uploads"));

//use router for bookServer using bookserver.use()
//server get route for root url"/" using bookServer.get("/",(req,res)=>{res.send("Hello WOrld")})
bookServer.listen(3000, () => {
  console.log("Book server listening on port:", PORT);
});
