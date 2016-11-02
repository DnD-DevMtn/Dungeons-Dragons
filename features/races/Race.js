const mongoose = require("mongoose");

const Race = new mongoose.Schema({
    name: {type: String, required: true, uinque: true, timr: true}
    , traitBonus: {
        plus: [{
            statName: {type: String, trim: true}
            , plusAmt: {type: Number}
        }]
        , minus: [{
            statName: {type: String, trim: true}
            , minusAmt: {type: Number}
        }]
        , desc: {type: String, trim: true}
    }
    , pictures: {
        male: [{type: String, trim: true}]
        , female: [{type: String, trim: true}]
    }
    , size: {type: String, required: true, trim: true}
    , baseAge: {type: Number, required: true}
    , height: {
        male:{
            baseHeight: {
                feet: {type: Number, required: true}
                , inches: {type: Number, required: true}
            }
            , heightMod: {
                diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
                , diceNum: {type: Number, required: true}
            }
        }
        , female:{
            baseHeight: {
                feet: {type: Number, required: true}
                , inches: {type: Number, required: true}
            }
            , heightMod: {
                diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
                , diceNum: {type: Number, required: true}
            }
        }
    }
    , weight: {
        male:{
            baseWeight: {type: Number, required: true}
            , weightMod: {
                diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
                , diceNum: {type: Number, required: true}
                , multiplier: {type: Number}
            }
        }
        , female:{
            baseWeight: {type: Number, required: true}
            , weightMod: {
                diceType: {type: Number, required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
                , diceNum: {type: Number, required: true}
                , multiplier: {type: Number}
            }
        }
    }
    , raceType: {type: String, trim: true}
    , baseSpeed: {type: Number, trim: true}
    , languages: [{type: String, trim: true}]
    , racialTraits: [{
        traitType: {type: String, trim: true}
        , traitName: {type: String, trim: true}
        , targetStats: [{type: String, trim: true}]
        , bonusNum: {type: Number}
        , desc: {type: String, trim: true}
    }]
    , favoredClasses: [{type: mongoose.Schema.Types.ObjectId, ref: "CharClass"}]
    , description: {
        general: {type: String, required: true, trim: true}
        , physicalDescription: {type: String, required: true, trim: true}
        , society: {type: String, required: true, trim: true}
        , relations: {type: String, required: true, trim: true}
        , alignment: {type: String, required: true, trim: true}
        , adventures: {type: String, required: true, trim: true}
    }
});

module.exports = mongoose.model("Race", Race);
