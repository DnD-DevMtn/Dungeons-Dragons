const mongoose = require("mongoose");

const Weapon = new mongoose.Schema({
    name: {type: "String", required: true, unique: true}
    , proficiency: {type: "String", required: true, enum: ["Simple", "Martial", "Exotic"]}
    , weaponType: {type: "String", required: true, enum: ["Unarmed", "Light", "One-Handed", "Two-Handed", "Ranged", "Ammunition"]}
    , damage: {
        m: {
            damageType: {type: "String", enum: ["slashing", "piercing", "bludgeon"]}
            , diceType: {type: "Number", required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
            , numOfDice: {type: "Number", required: true, min: 1}
        }
        , s: {
            damageType: {type: "String", enum: ["slashing", "piercing", "bludgeon"]}
            , diceType: {type: "Number", required: true, enum: [2, 3, 4, 6, 8, 10, 12, 20]}
            , numOfDice: {type: "Number", required: true, min: 1}
        }
    }
    , crit: {
        critRange: {type: "Number", required: true, max: 20, default: 20}
        , damageMultiplier: {type: "Number", required: true, min: 2, default: 2}
    }
    , range: {type: "Number"}
    , weight: {type: "Number", required: true, min: 0, default: 0}
    , magic: {
        stat: {type: "String", enum: ["str", "dex", "con", "int", "wis", "cha", "fort", "ref", "will"]}
        , bonus: {type: "Number"}
        , magicDamage: {
            damageType: {type: "String"}
            , bonusDamage: {type: "Number"}
            , bonusDice: {type: "Number", enum: [2, 3, 4, 6, 8, 10, 12, 20]}
            , bonusNumOfDice: {type: "String"}
        }
    }
    , description: "String"
    , cost: {type: "Number", min: 0, default: 0}

});

module.exports = mongoose.model("Weapon", Weapon);
