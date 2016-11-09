const mongoose = require("mongoose");

const Monster = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
    , picture: {type: String, required: true}
    , hp: {type: Number, required: true}
    , initiative: {type: Number, required: true}
    , cr: {type: Number, required: true}
    , size: {type: String, enum: ["tiny", "small", "medium", "large", "huge"], trim: true}
    , speed: {type: Number, required: true}
    , goldDrop: {type: Number, requried: true}
    , melee: {
        toHit: {type: Number, required: true}
        , damage: {
            diceType: {type: Number, required: true}
            , numDice: {type: Number, required: true}
            , mod: {type: Number, required: true}
        }
    }
    , ranged: {
        toHit: {type: Number, required: true}
        , damage: {
            diceType: {type: Number, required: true}
            , numDice: {type: Number, required: true}
            , mod: {type: Number, required: true}
        }
    }
    , ac: {type: Number, required: true}
    , xp: {type: Number, required: true}
    , description: {type: String, required: true, trim: true}
});

module.exports = mongoose.model("Monster", Monster);
