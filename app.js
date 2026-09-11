const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
var methodOverride = require('method-override')
const cookieParser = require('cookie-parser');

const router = require("./routes/routes");

const moment = require("moment");

const AuthUser = require("./models/Schema");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static("public"));

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.moment = moment;


// Ensure MongoDB connection middleware for Serverless (Vercel) & Local
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("Connected to MongoDB successfully!");
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    return res.status(500).send("Database Connection Error: " + err.message);
  }
});

// Middleware to make currentUser available in all EJS templates
app.use(async (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    try {
      const user = await AuthUser.findById(req.cookies.userId);
      res.locals.currentUser = user || null;
    } catch (err) {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
});

app.use("/" , router);

// 404 Error page (Must be the last middleware)
app.use((req, res) => {
  res.render("user/error", { err: "We couldn't find this page pls try another url" });
});

if (process.env.NODE_ENV !== "production" && require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch((err) => {
    console.error("Failed to connect to MongoDB locally:", err);
  });
}

module.exports = app;
