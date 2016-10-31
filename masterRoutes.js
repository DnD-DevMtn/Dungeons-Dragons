const userRoutes = require("./features/users/userRoutes.js");
const gameRoutes = require("./features/campaign/campaignRoutes.js");
const armorRoutes = require("./features/items/armor/armorRoutes.js");
const weaponRoutes = require("./features/items/weapons/weaponRoutes.js");
const gearRoutes = require("./features/items/gear/gearRoutes.js");
const monsterRoutes = require("./features/monsters/monsterRoutes.js");
const spellRoutes = require("./features/spells/spellRoutes.js");

module.exports = function(app){
  userRoutes(app);
  gameRoutes(app);
  armorRoutes(app);
  weaponRoutes(app);
  gearRoutes(app);
  monsterRoutes(app);
  spellRoutes(app);
}
