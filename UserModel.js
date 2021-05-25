const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

exports.saveUser = function (inUser, inPassword) {
    var user = new User({
        user: inUser,
        password: inPassword,
    });
    user.save();
};



exports.getUser = async function (Uuser) {
    return await User.findOne({ user: Uuser });
}