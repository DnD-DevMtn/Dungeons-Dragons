const userRoutes    = require("./features/users/userRoutes.js");
const gameRoutes    = require("./features/campaign/campaignRoutes.js");
const armorRoutes   = require("./features/items/armor/armorRoutes.js");
const weaponRoutes  = require("./features/items/weapons/weaponRoutes.js");
const gearRoutes    = require("./features/items/gear/gearRoutes.js");
const monsterRoutes = require("./features/monsters/monsterRoutes.js");
const raceRoutes    = require("./features/races/raceRoutes.js");
const classRoutes   = require("./features/classes/classRoutes.js");
const dungeonRoutes = require("./features/dungeons/dungeonRoutes.js");

module.exports = app => {
    userRoutes(app);
    gameRoutes(app);
    armorRoutes(app);
    weaponRoutes(app);
    gearRoutes(app);
    monsterRoutes(app);
    raceRoutes(app);
    classRoutes(app);
    dungeonRoutes(app);
}
