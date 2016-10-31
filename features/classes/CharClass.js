const mongoose = require("mongoose");

const CharClass = new mongoose.Schema({
    name: {type: String, required: true, unique: true, trim: true}
    , hitDie: {
        diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
        , diceNum: {type: Number, required: true}
    }
    , startingWealth: {
        diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
        , diceNum: {type: Number, required: true}
        , modifier:{type: Number, required: true}
    }
    , classSkills: [{type: String, trim: true}]
    , ranksPerLvl: {type: Number, required: true}
    , classLvl: [{
        level: {type: Number, required: true}
        , baseAttack: {type: Number}
        , fort: {type: Number}
        , ref: {type: Number}
        , will: {type: Number}
        , specials: [{
            name: {type: String}
            , lvl: {type: Number}
        }]
        , spellsPerDay: [{
            cantrip: {type: Number}
            , one: {type: Number}
            , two: {type: Number}
            , three: {type: Number}
            , four: {type: Number}
            , five: {type: Number}
            , six: {type: Number}
            , seven: {type: Number}
            , eight: {type: Number}
            , nine: {type: Number}
        }]
    }]
    , description: {
        general: {type: String, required: true, trim: true}
        , role: {type: String, required: true, trim: true}
        , alignmentDesc: {type: String, required: true, trim: true}
        , specialDesc: [{type: String, required: true, trim: true}]
    }
});

module.exports = mongoose.model("CharClass", CharClass);
