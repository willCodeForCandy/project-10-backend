const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to database 🔌');
  } catch (error) {
    console.log('Database is down 🪦');
  }
};

module.exports = { connectDB };
