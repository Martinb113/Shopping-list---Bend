require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI; // Get the connection string from the .env file

/*mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas!');
});

module.exports = mongoose;
