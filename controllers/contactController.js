const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, contactNo, message } = req.body;

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      //   contactNo,
      message,
    });

    await newContact.save();

    res.status(201).json({ msg: "Your message has been sent successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contact form entries with pagination (GET)
exports.getContacts = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by name (either first name, last name, or email)
    const { name, sortBy, sortOrder } = req.query;

    // Initialize filter object
    const filter = {};

    if (name) {
      // Use regex to search in firstName or email
      filter.$or = [
        { firstName: { $regex: name, $options: "i" } }, // Case-insensitive search in firstName
        { email: { $regex: name, $options: "i" } }, // Case-insensitive search in email
      ];
    }

    // Initialize sort object
    let sort = {};

    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1; // -1 for descending, 1 for ascending
      sort[sortBy] = order;
    }

    // Fetch contacts with pagination, filters, and sorting
    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count the total number of filtered contacts
    const totalContacts = await Contact.countDocuments(filter);

    res.status(200).json({
      page,
      totalPages: Math.ceil(totalContacts / limit),
      totalContacts,
      limit,
      contacts,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
