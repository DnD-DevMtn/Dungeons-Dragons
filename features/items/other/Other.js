const mongoose = require("mongoose");

const Other = new mongoose.Schema({
    name: {type: "String", required: true, unique: true}
    , weight: {type: "Number", required: true, min: 0, default: 0}
    , magic: {
        buffStat: {type: "String", enum: ["str", "dex", "con", "int", "wis", "cha", "fort", "ref", "will", "ac", "ba"]}
        , bonus: "Number"
        , extraBonus: {type: "String"}
    }
    , description: "String"
    , cost: {type: "Number", min: 0, default: 0}
});

module.exports = mongoose.model("Other", Other)
