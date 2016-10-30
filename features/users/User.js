const mongoose  = require("mongoose");
const Character = require("./Character");

const User = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true}
    , firstName: {type: String, required: true, trim: true}
    , lastName: {type: String, required: true, trim: true}
    , email: {type: String, required: true, trim: true, unique: true}
    , facebookId: {type: String, required: true, trim: true, unique: true}
    , profilePic: {type: String}
    , characters: [Character]
    , dmCampaigns: [{
        campaignName: {type: String, trim: true, unique: true}
        , partySize: {type: Number, min: 0, default: 0}
        , numOfDungeons: {type: Number, min: 0, default: 0}
    }]
});

module.exports = mongoose.model("User", User);
