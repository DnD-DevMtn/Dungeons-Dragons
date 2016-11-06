const mongoose = require("mongoose");
const Dungeon  = require("./Dungeon");

const Campaign = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
    , dm: {type: Object}
    , available: Boolean
    , maxPlayers: Number
    , level: Number
    , players: [{
        _id: false
        , facebookId: {type: String, trim: true}
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
