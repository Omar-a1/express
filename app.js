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

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully!");
      if (process.env.NODE_ENV !== "production") {
        app.listen(port, () => {
          console.log(`Server running at http://localhost:${port}`);
        });
      }
    })
    .catch((err) => {
      console.log("Failed to connect to MongoDB:", err);
    });
}

module.exports = app;
