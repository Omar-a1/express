const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// define the Schema (the structure of the article)
const userSchema = new Schema({
    userName: String,
    password: String,
    profileImage: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User

