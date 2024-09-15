const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PWD}@cluster0.zdanq0f.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
