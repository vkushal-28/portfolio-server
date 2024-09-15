const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { validateProject } = require("../middleware/validationMiddleware");

// POST /projects - Create a new project
router.post("/project", validateProject, projectController.createProject);

// GET /projects - Get all projects with filtering and sorting
router.get("/projects", projectController.getProjects);

// PUT /projects/:id - Update a project by ID
router.put("/project/:id", validateProject, projectController.updateProject);

// DELETE /projects/:id - Delete a project by ID
router.delete("/project/:id", projectController.deleteProject);

// GET /get-upload-url - get aws s3 url to upload image
router.get("/get-upload-url", projectController.getImageURL);

module.exports = router;
