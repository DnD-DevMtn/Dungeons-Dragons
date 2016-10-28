const mongoose = require("mongoose");

const Spell = new mongoose.Schema({
    name: {type: "String", required: true, unique: true}
    , spellType: {type: "String", required: true, enum: ["Offensive", "Buff", "De-Buff", "Other"]}
    , charClass: [{type: "String", requried: true, enum: ["Wizard", "Sorcerer", "Cleric", "Druid", "Ranger", "Paladin"]}]
    , school: {type: "String", required: true}
    , castTime: {type: "Number"}
    , components: [{type: "String"}]
    , range: {type: "String"}
    , target: {type: "String"}
    , duration: {
        unit: {type: "String"}
        , perLevel: {type: "Number"}
        , num: {type: "Number"}
    }
    , saveThrow: {
        saveType: {type: "String", enum: ["fort", "ref", "will"]}
        , dc: {type: "Number"}
    }
    , damage: {
        damageType: {type: "Number", enum: ["cold", "elec", "fire", "acid"]}
        , diceType: {type: "Number", enum: [2, 3, 4, 6, 8, 10, 12, 20]}
        , dicePerLevel: {type: "Number"}
    }
    , aoe: {
        aoeRange: "Number"
        , aoeShape: {type: "String", enum: ["Target", "Radius", "Cone", "Line"]}
    }
    , buffBonus: {
        buffStat: "String"
        , bonus: "Number"
        , extraBonus: "String"
    }
    , deBuff: {
        debuffStat: "String"
        , effect: "Number"
        , extraEffect: "String"
    }
    , addCondition: {
        condition: "String"
        , target: {type: "String", enum: ["Actor", "Environment"]}
    }
    , description: "String"
});

module.exports = mongoose.model("Spell", Spell);
