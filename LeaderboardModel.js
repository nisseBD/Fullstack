const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    user: String,
    points: String,
});

const Record = mongoose.model("Record", recordSchema);

exports.saveRecord = function (inUser, inPoints) {
    var record = new Record({
        user: inUser,
        points: inPoints,
    });
    record.save();
};

exports.getRecord = async function () {
    return await Record.find();
}

exports.getUserRecord = async function (user) {
    return await Record.findOne({ user: user });
}

exports.updateUserRecord = async function (user, points) {
    const userRecord = await Record.findOne({ user: user });

    if (userRecord.points < points) {
        userRecord.points = points
        await userRecord.save()
    }

}


