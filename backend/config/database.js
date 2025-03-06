const session = require("express-session"); // Import express-session
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
