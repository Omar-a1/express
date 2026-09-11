const express = require('express');
const router = express.Router();
const User = require("../models/customerSchema");
const AuthUser = require("../models/Schema");
const bcrypt = require("bcrypt");
var moment = require("moment");
// ================= Authentication Routes ================= //

router.get("/", (req, res) => {
  if (req.cookies && req.cookies.status === "signed") {
    return res.redirect("/home");
  }
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  if (req.cookies && req.cookies.status === "signed") {
    return res.redirect("/home");
  }
  res.render("log-in");
});


router.post("/login", async (req, res) => {
  try {
    if (req.cookies && req.cookies.status === "signed") {
      return res.redirect("/home");
    }
    const check = await AuthUser.findOne({ userName: req.body.userName });
    if (!check) {
      return res.send("This username does not exist! Try another name.");
    }
    const isMatch = await bcrypt.compare(req.body.password, check.password);
    if (!isMatch) {
      return res.send("Incorrect password! Try again.");
    }
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    res.cookie("status", "signed", { maxAge: oneYear });
    res.cookie("userId", check._id.toString(), { maxAge: oneYear });
    return res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/signup", (req, res) => {
  if (req.cookies && req.cookies.status === "signed") {
    return res.redirect("/home");
  }
  res.render("sign-up");
});


router.post("/signup", async (req, res) => {
  try {
    const existingUser = await AuthUser.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.send("This username is already taken! Try another name.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new AuthUser({
      userName: req.body.userName,
      password: hash,
      profileImage: req.body.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    });

    const savedUser = await newUser.save();
    res.cookie("status", "signed", { maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("userId", savedUser._id.toString(), { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("status");
  res.clearCookie("userId");
  res.redirect("/login");
});

// ================= Main App Routes ================= //


router.get("/home", async (req, res) => {
  try {
    const result = await User.find();
    res.render("index", { arr: result });
    // console.log(result)
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/add", (req, res) => {
  res.render("user/add");
});

router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.render("user/edit", { user: User });
  } catch (err) {
    res.render("user/error", { err: "User not found" });
  }
});


router.get("/view/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.render("user/view", { user: User });

  } catch (err) {
    res.render("user/error", { err: "User not found" });
  }
});

// POST Requst
router.post("/user/add", (req, res) => {

  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

// search 
// POST Requst
router.post("/search", (req, res) => {
  const searchText = req.body.searchText.trim();
  const lowerSearch = searchText.toLowerCase()
  User.find({ $or: [{ fireName: lowerSearch }, { lastName: lowerSearch }] })
    .then((result) => {
      res.render("user/search", { arr: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// PUT Request
router.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, req.body);
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.render("user/error", { err: "Failed to update user" });
  }
});

// DELETE Requst
router.delete("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.render("user/error", { err: "Failed to delete user" });
  }
});

module.exports = router;