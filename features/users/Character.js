const mongoose = require("mongoose");

const Character = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
    , race: {type: mongoose.Schema.Types.ObjectId, ref: "Race", required: true}
    , classType: {type: mongoose.Schema.Types.ObjectId, ref: "CharClass", required: true}
    , level: {type: Number, required: true}
    , descprition: {
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
        _id: false
        , skill: {type: String, trim: true}
        , rank: {type: Number, min: 0, default: 0}
    }]
    , feats: [{
        _id: false
        , feat: {type: String, trim: true}
        , target: {type: String, trim: true}
    }]
    , armor: [{type: mongoose.Schema.Types.ObjectId, ref: "Armor"}]
    , weapons: [{type: mongoose.Schema.Types.ObjectId, ref: "Weapon"}]
    , gear: [{type: mongoose.Schema.Types.ObjectId, ref: "Gear"}]
    , spells: [{type: mongoose.Schema.Types.ObjectId, ref: "Spell"}]
    , domain: [{type: String}]
    , diety: {type: String}
    , languages: [{type: String, trim: true}]
    , specialAbilities: [{
        _id: false
        , specAbilName: {type: String, trim: true}
        , specAbilLvl: {type: Number}
    }]
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
            _id: false
            , skillName: {type: String, trim: true}
            , skillMod: {type: Number}
        }]
        , tempConditions: [{
            _id: false
            , condition: {type: String, trim: true}
        }]
    }
});

module.exports = Character;
