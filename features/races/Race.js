const mongoose = require("mongoose");

const Race = new mongoose.Schema({
    name: {type: String, required: true, uinque: true, trim: true}
    , traitBonus: {
        plus: [{
            _id: false
            , statName: {type: String, trim: true}
            , plusAmt: {type: Number}
        }]
        , minus: [{
            _id: false
            , statName: {type: String, trim: true}
            , minusAmt: {type: Number}
        }]
        , desc: {type: String, trim: true}
    }
    , pictures: {
        male: [{type: String, trim: true}]
        , female: [{type: String, trim: true}]
    }
    , size: {type: String, required: true, trim: true}
    , raceType: {type: String, trim: true}
    , baseSpeed: {type: Number, trim: true}
    , languages: [{type: String, trim: true}]
    , racialTraits: [{
        _id: false
        , traitType: {type: String, trim: true}
        , traitName: {type: String, trim: true}
        , targetStats: [{type: String, trim: true}]
        , bonusNum: {type: Number}
        , desc: {type: String, trim: true}
    }]
    , favoredClasses: [{type: mongoose.Schema.Types.ObjectId, ref: "CharClass"}]
    , description: {type: String, required: true, trim: true}
});

module.exports = mongoose.model("Race", Race);
