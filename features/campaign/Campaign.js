const mongoose  = require("mongoose");
const Dungeon   = require("./Dungeon");
const Character = require("../users/Character");

const Campaign = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
    , dm: {
        name: {type: String, required: true, trim: true}
        , facebookId: {type: String, required: true, trim: true}
    }
    , maxPlayers: Number
    , level: Number
    , status: {type: String, trim: true, required: true, enum: ["open", "closed", "completed"]}
    , players: [{
        _id: false
        , facebookId: {type: String, trim: true}
        , character: Character
    }]
    , dungeons: [{type: mongoose.Schema.Types.ObjectId, ref: "Dungeon"}]
    , description: {
        background: {type: String, required: true, trim: true}
        , story: {type: String, required: true, trim: true}
    }
});

module.exports = mongoose.model("Campaign", Campaign);
