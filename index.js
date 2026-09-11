const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const user = require("./models/Schema");

dotenv.config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("log-in");
});

app.post("/login", async (req, res) => {
    try {
        const check = await user.findOne({ userName: req.body.userName });
        if (!check) {
            return res.send("This username is not exsist! Try another Name");
        }

        const isMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isMatch) {
            return res.send("This password is not match! Try another Password");
        }
        
        res.render("home");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
});

app.get("/signup", (req, res) => {
    res.render("sign-up");
})
app.post("/signup", async (req, res) => {
    try {
        
        const existingUser = await user.findOne({ userName: req.body.userName });
        if (existingUser) {
            // if user is already exsist
            return res.send("This username is already taken! Try another Name");
        }
        const numOfSalt = 10;
        const hash = await bcrypt.hash(req.body.password, numOfSalt);
        const newUser = new user({
            userName: req.body.userName,
            password: hash
        });
        await newUser.save();
        res.render("home");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});