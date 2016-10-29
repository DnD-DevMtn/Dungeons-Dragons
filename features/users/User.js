const mongoose  = require("mongoose");
const Character = require("./Character");

const User = new mongoose.Schema({
    firstName:
    , lastName:
    , email:
    , facebookId:
    , characters: [Character]
    , dmCampaigns: [{type: mongoose.Schema.Types.ObjectId, ref: }]
});

module.exports = mongoose.model("User", User);
