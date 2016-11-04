const mongoose = require("mongoose");

const Dungeon = new mongoose.Schema({
    name: {type: String, trim: true, required: true}
    , height: {type: Number, required: true}
    , width: {type: Number, required: true}
    , monsters: [{
        _id: false
        , monster: {type: mongoose.Schema.Types.ObjectId, ref: "Monster"}
        , image: String
        , location: {
            x: Number
            , y: Number
        }
    }]
    , environment: [{
        _id: false
        , thing: {type: String, trim: true}
        , image: String
        , location: {
            x: Number
            , y: Number
        }
    }]
    , background: [{
        _id: false
        , tile: {type: String}
        , image: String
        , location: {
            x: Number
            , y: Number
        }
    }]
    , items: {
        armor: [{
            _id: false
            , armorType: {type: mongoose.Schema.Types.ObjectId, ref: "Armor"}
            , location: {
                x: Number
                , y: Number
            }
        }]
        , weapons: [{
            _id: false
            , weaponType: {type: mongoose.Schema.Types.ObjectId, ref: "Weapon"}
            , location: {
                x: Number
                , y: Number
            }
        }]
        , gear: [{
            _id: false
            , gearType: {type: mongoose.Schema.Types.ObjectId, ref: "Gear"}
            , location: {
                x: Number
                , y: Number
            }
        }]
    }
    , traps: [{
        _id: false
        , trap: {
            name: String
            , damage: {
                diceType: Number
                , diceNum: Number
            }
            , triggered: Boolean
        }
        , location: {
            x: Number
            , y: Number
        }
    }]
    , startingLocation: [{
        _id: false
        , x: Number
        , y: Number
    }]
});

module.exports = Dungeon;
