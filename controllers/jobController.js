//import model
const jobs = require("../models/jobModel");

//add jobs
exports.addJob = async (req, res) => {
  console.log("inside addjobcontroller");
  const {
    title,
    location,
    jobType,
    salary,
    qualification,
    experience,
    description,
  } = req.body;
  console.log(req.body);

  try {
    const existingJob = await jobs.findOne({ title, location });
    if (existingJob) {
      res.status(401).json("Job already exists");
    } else {
      const newJob = new jobs({
        title,
        location,
        jobType,
        salary,
        qualification,
        experience,
        description,
      });
      await newJob.save();
      res.status(200).json(newJob);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while adding job", error: err.message });
  }
};

//getjob
exports.getJobs = async (req, res) => {
  try {
    const allJobs = await jobs.find();
    res.status(200).json(allJobs);
  } catch (error) {
    res.status(500).json("error" + error);
  }
};

//delete job
exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await jobs.findByIdAndDelete({ _id: id });
    res.status(200).json("job deleted");
  } catch (error) {
    res.status(500).json("error" + error);
  }
};
