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
    , backgroundImage: {type: String, trim: true, required: true}
    , items: {
        armor: [{
            _id: false
            , item: {type: mongoose.Schema.Types.ObjectId, ref: "Armor"}
            , settings: {
                found: Boolean
                , findDC: Number
            }
            , location: {
                x: Number
                , y: Number
            }
        }]
        , weapons: [{
            _id: false
            , item: {type: mongoose.Schema.Types.ObjectId, ref: "Weapon"}
            , settings: {
                found: Boolean
                , findDC: Number
            }
            , location: {
                x: Number
                , y: Number
            }
        }]
        , gear: [{
            _id: false
            , item: {type: mongoose.Schema.Types.ObjectId, ref: "Gear"}
            , settings:{
                found: Boolean
                , findDC: Number
            }
            , location: {
                x: Number
                , y: Number
            }
        }]
    }
    , doors: [{
        _id: false
        , settings: {
            name: String
            , bashDC: Number
            , hp: Number
            , locked: Boolean
            , pickDC: Number
        }
        , location: {
            x: Number
            , y: Number
        }
    }]
    , traps: [{
        _id: false
        , settings: {
            name: String
            , findDC: Number
            , disarmDC: Number
            , found: Boolean
            , triggered: Boolean
            , damage: {
                diceType: Number
                , diceNum: Number
                , mod: Number
            }
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

module.exports = mongoose.model("Dungeon", Dungeon);
