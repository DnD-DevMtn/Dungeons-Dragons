const mongoose = require("mongoose");

const Character = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
    , race: {type: String, required: true}
    , classType: {type: "String", required: true}
    , sprite: {type: String, required: true, trim: true}
    , level: {type: Number, required: true}
    , alignment: {type : String, required : true, trim : true}
    , descprition: {
        sex: {type: String, enum: ["male", "female"]}
        , height: {type: Number}
        , weight: {type: Number}
        , eyeColor: {type: String, trim: true}
        , hairColor: {type: String, trim: true}
        , hairStyle: {type: String, trim: true}
        , age: {type: Number}
        , skinColor: {type: String, trim: true}
    }
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
    , speed: {type: Number}
    , saves: {
        fort: {type: Number}
        , ref: {type: Number}
        , will: {type: Number}
    }
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
