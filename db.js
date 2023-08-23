const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.ATLAS_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection established successfully');
  } catch (err) {
    console.error('Error in DB connection: ' + err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
