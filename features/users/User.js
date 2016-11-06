const mongoose  = require("mongoose");
const Character = require("./Character");

const User = new mongoose.Schema({
    username: {type: String, trim: true}
    , firstName: {type: String, required: true, trim: true}
    , lastName: {type: String, required: true, trim: true}
    , facebookId: {type: String, required: true, trim: true, unique: true}
    , profilePic: {type: String}
    , characters: [Character]
    , campaigns: [{type: mongoose.Schema.Types.ObjectId, ref: "Campaign"}]
});

module.exports = mongoose.model("User", User);
