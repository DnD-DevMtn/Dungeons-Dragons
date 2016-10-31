const mongoose = require("mongoose");

const Dungeon = new mongoose.Schema({
    name: {type: String, trim: true, required: true}
    , monsters: [{
        monster: {type: mongoose.Schema.Types.ObjectId, ref: "Monster"}
        , postion: {
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }
    }]
    , environment: [{
        thing: {type: String, trim: true}
        , postion: {
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }
    }]
    , items: {
        armor: [{
            armorType: {type: mongoose.Schema.Types.ObjectId, ref: "Armor"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
        , weapons: [{
            weaponType: {type: mongoose.Schema.Types.ObjectId, ref: "Weapon"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
        , gear: [{
            gearType: {type: mongoose.Schema.Types.ObjectId, ref: "Gear"}
            , postion: {
                row: {type: Number, required: true}
                , column: {type: Number, required: true}
            }
        }]
    }
    , traps: [{
        trap: {type: String, trim: true}
        , trigger: [{
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }]
        , targetSquares: [{
            row: {type: Number, required: true}
            , column: {type: Number, required: true}
        }]
    }]
});

module.exports = Dungeon;
