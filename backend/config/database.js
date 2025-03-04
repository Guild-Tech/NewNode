// backend/config/database.js
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://guildtechnology0:AGNKDFi6644ZkkEd@cluster0.tdauz.mongodb.net/Node", {
  serverSelectionTimeoutMS: 20000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
