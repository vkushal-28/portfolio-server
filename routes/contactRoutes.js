const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { validateContact } = require("../middleware/validationMiddleware");

// Validation rules for contact form
router.post("/contact", validateContact, contactController.submitContactForm);

// Get all contact entries with pagination (GET)
router.get("/contacts", contactController.getContacts);

module.exports = router;
