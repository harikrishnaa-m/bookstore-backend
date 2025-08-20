const applicants = require("../models/applicantModel");

// Add application
exports.addApplication = async (req, res) => {
  console.log("inside addApplicationController");
  const { fullName, jobTitle, qualification, email, phone, coverletter } =
    req.body;
  const resume = req.file.filename;
  console.log(req.body);

  try {
    const existingApplicant = await applicants.findOne({ email, jobTitle });
    if (existingApplicant) {
      res.status(401).json("Application already exists for this job and email");
    } else {
      const newApplicant = new applicants({
        fullName,
        jobTitle,
        qualification,
        email,
        phone,
        coverletter,
        resume,
      });
      await newApplicant.save();
      res.status(200).json(newApplicant);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while adding application", error: err.message });
  }
};

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const allApplications = await applicants.find();
    res.status(200).json(allApplications);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching applications",
      error: error.message,
    });
  }
};
