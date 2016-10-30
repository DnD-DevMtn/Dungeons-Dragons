const mongoose = require("mongoose");

const Monster = new mongoose.Schema({
    name: {type: "String", required: true, unique: true}
    , sprite: {
        normal: {type: "String", required: true}
        , attacking: "String"
        , dead: "String"
    }
    , hp: {type: "Number", required: true}
    , cr: "Number"
    , alignment: {
        goodEvil: {type: "String", enum: ["good", "neutral", "evil"], trim: true}
        , lawChaos: {type: "String", enum: ["lawful", "neutral", "chaotic"], trim: true}
    }
    , baseStats: {
        str: {type: "Number", required: true}
        , dex: {type: "Number", required: true}
        , con: {type: "Number", required: true}
        , int: {type: "Number", required: true}
        , wis: {type: "Number", required: true}
        , cha: {type: "Number", required: true}
    }
    , size: {type: "String", enum: ["tiny", "small", "medium", "large", "huge"], trim: true}
    , speed: {type: "Number", required: true}
    , saves: {
        fort: {type: "Number", required: true}
        , ref: {type: "Number", required: true}
        , will: {type: "Number", required: true}
    }
    , items: {
        armor: [{type: mongoose.Schema.Types.ObjectId, ref: "Armor"}]
        , weapons: [type: mongoose.Schema.Types.ObjectId, ref: "Weapon"]
        , gear: [{type: mongoose.Schema.Types.ObjectId, ref: "Other"}]
    }
    , goldDrop: "Number"
    , languages: [{type: "String"}]
    , baseAttack: {type: "Number"}
    , spells: [{type: mongoose.Schema.Types.ObjectId, ref: "Spell"}]
    , skills: [{type: String, trim: true}]
    , feats: [{type: String, trim: true}]
});

module.exports = mongoose.model("Monster", Monster);
