const userRoutes = require("./features/users/userRoutes.js");
const dungeonRoutes = require("./features/dungeons/dungeonRoutes.js");
const gameRoutes = require("./features/game/gameRoutes.js");
const itemRoutes = require("./features/items/itemRoutes.js");
const monsterRoutes = require("./features/monsters/monsterRoutes.js");
const spellRoutes = require("./features/spells/spellRoutes.js");

module.exports = function(app){
  userRoutes(app);
  dungeonRoutes(app);
  gameRoutes(app);
  itemRoutes(app);
  monsterRoutes(app);
  spellRoutes(app);
}
