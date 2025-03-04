const dotenv = require('dotenv');
dotenv.config(); // Loads your .env file

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

// Initialize the app
const app = express();

// Connect to MongoDB (database connection setup)
require('./config/database');

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

// Configure CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://nodebridge101.netlify.app",
    "https://node-307s.onrender.com"
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Set up MongoDB session store
const store = new MongoDBStore({
  uri: "mongodb+srv://guildtechnology0:AGNKDFi6644ZkkEd@cluster0.tdauz.mongodb.net/Node",
  collection: 'sessions',
});

store.on('error', (error) => console.error("❌ MongoDB Store Error:", error));

// Set up session middleware
app.use(session({
  store,
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // secure in production
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// Import route handlers
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRouter = require('./routes/paymentRoutes');
// If you have webhook routes, import and mount them appropriately

// Define routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRouter);
app.use("/admin", adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the API. Server is running successfully!");
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
