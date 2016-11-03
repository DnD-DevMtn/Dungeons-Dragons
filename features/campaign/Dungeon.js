const mongoose = require("mongoose");

const Dungeon = new mongoose.Schema({
    name: {type: String, trim: true, required: true}
    , monsters: [{
        _id: false
        , monster: {type: mongoose.Schema.Types.ObjectId, ref: "Monster"}
        , postion: {
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }
    }]
    , environment: [{
        _id: false
        , thing: {type: String, trim: true}
        , postion: {
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }
    }]
    , items: {
        armor: [{
            _id: false
            , armorType: {type: mongoose.Schema.Types.ObjectId, ref: "Armor"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
        , weapons: [{
            _id: false
            , weaponType: {type: mongoose.Schema.Types.ObjectId, ref: "Weapon"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
        , gear: [{
            _id: false
            , gearType: {type: mongoose.Schema.Types.ObjectId, ref: "Gear"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
    }
    , traps: [{
        _id: false
        , trap: {type: String, trim: true}
        , trigger: [{
            _id: false
            , row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }]
        , targetSquares: [{
            _id: false
            , row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }]
    }]
});

module.exports = Dungeon;
