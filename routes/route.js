//import express
const express = require("express");
//import jwtMiddleware
const jwtMiddleware = require("../middlewares/jwtMiddleware");
//import multer middleware
const multerMiddleware = require("../middlewares/multerMiddleware");
//import bookController
const bookController = require("../controllers/bookController");
//import jobController
const jobController = require("../controllers/jobController");
//import applicationController
const applicationController = require("../controllers/applicationController");
//create an instance of route
const route = new express.Router();
//import controller
const usercontroller = require("../controllers/userController");
//defining paths
//api call for register
route.post("/api/register", usercontroller.register);
route.post("/api/login", usercontroller.login);
route.post("/api/google-login", usercontroller.googleAuth);
//define add book route using bookcontroller.addbook and jwtmiddleware
route.post(
  "/api/addBook",
  jwtMiddleware,
  multerMiddleware.array("UploadedImages", 3),
  bookController.addBook
);
//define gethomebook for homebook no jwt middleware but not the case for allbooks
route.get("/api/homebooks", bookController.getHomeBooks);
route.get("/api/allbooks", jwtMiddleware, bookController.getAllBooks);
route.get("/api/getABook/:id", jwtMiddleware, bookController.getABook);
route.get(
  "/api/admin-allBooks",
  jwtMiddleware,
  bookController.getAllBookAdminController
);
route.put(
  "/api/admin-approvedBook",
  jwtMiddleware,
  bookController.approveBooksAdminController
);
route.get("/api/admin-users", jwtMiddleware, usercontroller.adminGetAllUsers);
//routes for jobs
route.get("/api/admin-allJobs", jwtMiddleware, jobController.getJobs);
route.post("/api/admin-addJobs", jwtMiddleware, jobController.addJob);
route.delete(
  "/api/admin-deleteJob/:id",
  jwtMiddleware,
  jobController.deleteJob
);
route.put(
  "/api/update-admin",
  jwtMiddleware,
  multerMiddleware.single("profile"),
  usercontroller.updateAdminDetails
);
route.get("/api/admin-details", jwtMiddleware, usercontroller.getAdminDetails);
route.put("/api/make-payment", jwtMiddleware, bookController.makepayment);
route.post(
  "/api/addApplication",
  jwtMiddleware,
  multerMiddleware.single("resume"),
  applicationController.addApplication
);
route.get(
  "/api/getApplicants",
  jwtMiddleware,
  applicationController.getApplications
);
//exporting the route
module.exports = route;
