const mongoose = require("mongoose");

const Armor = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
    , bonus: {type: Number, required: true, min: 0, default: 0}
    , type: {type: String, required: true}
    , maxDex: {type: Number, min: 0}
    , checkPenalty: {type: Number, required: true, min: 0, default: 0}
    , spellFail: {type: Number, required: true, min: 0, default: 0}
    , speed: {
        medium: {type: Number}
        , small: {type: Number}
    }
    , weight: {type: Number, required: true, min: 0, default: 0}
    , magic: {
        stat: {type: String}
        , bonus: {type: Number}
        , condition: String
    }
    , description: {type: String}
    , cost: {type: Number, min: 0, default: 0}
});

module.exports = mongoose.model("Armor", Armor);
