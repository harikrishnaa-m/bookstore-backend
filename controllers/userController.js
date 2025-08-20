const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
//logic of all api calls

//1Register
exports.register = async (req, res) => {
  //collecting data from request body
  const { username, email, password, profile, bio } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      res.status(401).json("User already existing");
    } else {
      const newUser = new users({ username, email, password, profile, bio });
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      if (existinguser.password == password) {
        const token = jwt.sign(
          { userMail: existinguser.email },
          "superkey2025"
        );
        res.status(200).json({ existinguser, token });
      } else {
        res.status(400).send("password missmatch");
      }
    } else {
      res.status(400).send("email is not registered");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//googleauth
exports.googleAuth = async (req, res) => {
  const { username, email, password, photo } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      const token = jwt.sign({ userMail: existinguser.email }, "superkey2025");
      res.status(200).json({ existinguser, token });
    } else {
      const newUser = new users({ username, email, password, profile: photo });
      await newUser.save();
      const token = jwt.sign({ userMail: newUser.email }, "superkey2025");
      res.status(200).json({ existinguser: newUser, token });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//----------------------------------------------------ADMIN-------------------------------------------

exports.adminGetAllUsers = async (req, res) => {
  const email = req.payload.userMail;
  try {
    const allExistingUsers = await users.find({ email: { $ne: email } });
    res.status(200).json(allExistingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdminDetails = async (req, res) => {
  let { username, password, profile, bio } = req.body;
  profile = req.file ? req.file.filename : profile;
  const email = req.payload.userMail;
  try {
    const adminDetails = await users.findOneAndUpdate(
      { email },
      { username, email, password, profile, bio },
      { new: true }
    );

    res.status(200).json(adminDetails);
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

exports.getAdminDetails = async (req, res) => {
  const email = req.payload.userMail;
  try {
    const adminDetails = await users.find({ email, bio: "Admin" });
    if (adminDetails.length === 0) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(adminDetails);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
