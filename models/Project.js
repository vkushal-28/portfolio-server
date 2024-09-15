const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, "Technologies used are required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    demoLink: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: "Demo link must be a valid URL",
      },
    },
    codeLink: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: "Code link must be a valid URL",
      },
    },
    projectType: {
      type: String,
      enum: ["web", "mobile", "design"],
      required: [true, "Project type is required"],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model("Project", projectSchema);
