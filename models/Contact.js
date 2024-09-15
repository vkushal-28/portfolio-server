const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [3, "First name must be at least 3 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [3, "Last name must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  //   contactNo: {
  //     type: String,
  //     required: [true, "Contact number is required"],
  //     minlength: [10, "Contact number must be at least 10 digits"],
  //     maxlength: [15, "Contact number must be less than 15 digits"],
  //   },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [10, "Message must be at least 10 characters long"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
