const mongoose = require("mongoose");

const Character = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
    , race: {type: String, required: true, trim: true}
    , charClass: [
        classType: {type: String, required: true, trim: true}
        , classLvl: {type: Number, required: true}
    ]
    descprition: {
        sex: {type: String, enum: ["male", "female"]}
        , height: {type: Number, required: true}
        , weight: {type: Number, required: true}
        , eyeColor: {type: String, trim: true, required: true}
        , hairColor: {type: String, trim: true, required: true}
        , hairStyle: {type: String, trim: true, required: true}
        , age: {type: Number, required: true}
        , skinColor: {type: String, trim: true, required: true}
    }
    , totalLvl: {type: Number, required: true}
    , baseStats: {
        str: {type: Number, required: true}
        , dex: {type: Number, required: true}
        , con: {type: Number, required: true}
        , int: {type: Number, required: true}
        , wis: {type: Number, required: true}
        , cha: {type: Number, required: true}
    }
    , hp: {type: Number, required: true}
    , size: {type: String, enum: ["tiny", "small", "medium", "large", "huge"], trim: true}
    , speed: {type: Number, required: true}
    , saves: {
        fort: {type: Number, required: true}
        , ref: {type: Number, required: true}
        , will: {type: Number, required: true}
    }
    , skills: [{
        skill: {type: String, trim: true}
        , rank: {type: Number, min: 0, default: 0}
    }]
    , feats: [{
        feat: {type: String, trim: true}
        , target: {type: String, trim: true}
    }]
    , items: {
        armor: [{type: mongoose.Schema.Types.ObjectId, ref: "Armor"}]
        , weapons: [type: mongoose.Schema.Types.ObjectId, ref: "Weapon"]
        , gear: [{type: mongoose.Schema.Types.ObjectId, ref: "Other"}]
    }
    , spells: [{type: mongoose.Schema.Types.ObjectId, ref: "Spell"}]
    , domain: [{type: String}]
    , languages: [{type: String, trim: true}]
    , specialAbilities: [{type: String, trim: true}]
    , money: {
        copper: {type: Number}
        , silver: {type: Number}
        , gold: {type: Number}
        , platinum: {type: Number}
    }
    , xp: Number
    , tempStats: {
        tempHp: {type: Number}
        , tempStr: {type: Number}
        , tempDex: {type: Number}
        , tempCon: {type: Number}
        , tempInt: {type: Number}
        , tempWis: {type: Number}
        , tempCha: {type: Number}
        , tempRef: {type: Number}
        , tempFort: {type: Number}
        , tempWill: {type: Number}
        , tempSkill: [{
            skillName: {type: String, trim: true}
            , skillMod: {type: Number}
        }]
        , tempConditions: [{
            condition: {type: String, trim: true}
        }]
    }
});

module.exports = Character;
