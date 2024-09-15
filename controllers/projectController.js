const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// setting up s3 bucket
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();

  const imageName = `${uuidv4()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

exports.getImageURL = async (req, res) => {
  await generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

// Create Project
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Projects with Filtering and Sorting
exports.getProjects = async (req, res) => {
  try {
    const { projectType, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Set up the filter
    const filter = {};
    if (projectType) {
      filter.projectType = projectType;
    }

    // Set up the sort
    const sort = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      sort[sortBy] = order;
    }

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch projects with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    // Get the total count of documents
    const totalProjects = await Project.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalProjects / limitNumber);

    // Send response
    res.status(200).json({
      page: pageNumber,
      totalPages,
      totalProjects,
      limit: limitNumber,
      projects,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
