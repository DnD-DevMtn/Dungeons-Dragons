const mongoose = require("mongoose");
const Dungeon  = require("./Dungeon");

const Campaign = new mongoose.Schema({
    dm: {type: String}
    , players: [{
        _id: false
        , facebookId: {type: String, trim: true, unique: true}
        , character: {type: String, trim: true}
    }]
    , dungeons: [Dungeon]
    , description: {
        background: {type: String}
        , story: {type: String}
        , pictures: {type: String}
    }

});

module.exports = mongoose.model("Campaign", Campaign);
