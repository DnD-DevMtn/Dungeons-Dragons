const mongoose = require("mongoose");

const Monster = new mongoose.Schema({
    name: {type: "String", required: true, unique: true}
    , sprite: {
        normal: {type: "String", required: true}
        , attacking: "String"
        , dead: "String"
    }
    ,
    , cr: "Number"
    , alignment: {
        goodEvil: {type: "String", enum: ["good", "neutral", "evil"]}
        , lawChaos: {type: "String", enum: ["lawful", "neutral", "chaotic"]}
    }
    , baseStats: {
        str: {type: "Number", required: true}
        , dex: {type: "Number", required: true}
        , con: {type: "Number", required: true}
        , int: {type: "Number", required: true}
        , wis: {type: "Number", required: true}
        , cha: {type: "Number", required: true}
    }
    , size: {type: "String", enum: ["tiny", "small", "medium", "large", "huge"]}
    , speed: {type: "Number", required: true}


});

module.exports = mongoose.model("Monster", Monster);
