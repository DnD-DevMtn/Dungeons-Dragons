export default function engineService(socket){

    // this is the dungeon format that will be retrieved from the backend

    // the current user's character needs to be retrieved from the
    let user = {};
    let room;

    const Dungeon = {
        name: "this is a dungeon"
        , height: 10
        , width: 10
        , monsters: [{

        }]
        , background: [{

        }]
        , items: [{

        }]
        , traps: [{

        }]
        , players: [{

        }]
        , doors: [{

        }]
        , environment: [{

        }]
        , startingLocation: [{

        }]
    }

    const trapExample = {
        name: "Spikes"
        , found:  false             // can only be disarmed if found
        , findDC: 15                // how hard it is to find
        , disarmDC: 20              // how hard it is to disarm
        , triggered: false
        , damage: {
            diceType: 10
            , numDice: 1
            , mod: 2
        }
    }

    const itemsExample = [{
        item: {}
        , found: false
        , findDC: 15
    }]

    const doorExample = {
        name: "Simple Wooden Door"
        , bashDC: 15
        , hp: 20
        , locked: false
        , pickDC: 15
        , open: false
    }


    const Game = {
        board: []
        , user: {}
        , players: []
        , monsters: []
        , items: []
        , traps: []
        , environment: []
        , exploreOrder: []
        , combatOrder: []
        , exploreTurn: 0
        , combatTurn: 0
        , ids: []
        , actions: ["draw", "sheath"]
        , gameState: "explore"
        , turnOver: false
        , dmMode: false
    }

    this.getGame = () => {
        return Game;
    }


    // * * * GAME FUNCTIONS

    // all source and target params are objects containing x and y coordinates ie. source = {x: 5, y: 7}

    // explore options
    Game.actionOptions = () => {
        let source = Game.user.location;

        // Drop item is a universal action for all states
        Game.actions = ["dropItem"];
        if(Game.board[source.x][source.y].items.stuff.length > 0 && Game.board[source.x][source.y].items.found){
            Game.actions.push("pickUpItem");
        }

        // If the user has a weapon eqiupped then sheath is an action they can take, else they can equipped a weapon
        if(Game.user.equipped.name){
            Game.actions.push("sheath");
        } else {
            Game.actions.push("draw");
        }

        // All actions that can take place in explore [draw, sheath, drop, pickup, openDoor, closeDoor, perception, rogueLockpick, rogueTrapfind, rogueDisarmTrap]

        // checks the immediate squares around the player and returns available options.
        let adjacent = findAdjacent(source);
        let doorSqr = [                     // doors cannot be opened on the diagonal
              [source.x, source.y - 1]
            , [source.x, source.y + 1]
            , [source.x - 1, source.y]
            , [source.x + 1, source.y]
        ];

        if(Game.gameState === "explore"){
            Game.actions.push("perception");
            for(let i = 0; i < doorSqr.length; i++){
                let x = doorSqr[i][0], y = doorSqr[i][1];
                if(Game.board[x][y].door.id){
                    if(Game.board[x][y].door.open === false){
                        Game.actions.push("openDoor");
                        if(Game.user.equipped.name && Game.user.equipped.weaponType !== "Ranged"){
                            Game.actions.push("bash");
                        }
                        if(Game.user.actor.classType.name === "Rogue" && Game.board[x][y].door.locked === true){
                            Game.actions.push("lockpick");
                        }
                    }
                    if(Game.board[x][y].door.open === true){
                        Game.actions.push("closeDoor");
                    }
                }
            }
        }

        if(Game.gameState === "combat"){
            if(Game.user.equipped.name && Game.user.equipped.weaponType !== "Ranged"){
                for(let i = 0; i < adjacent.length; i++){
                    let x = adjacent[i][0], y = adjacent[i][1];
                    if(Game.board[x][y].type === "monster"){
                        Game.actions.push("melee");
                        if(Game.user.actor.classType.name === "Fighter"){
                            Game.actions.push("fighterPowerAttack");
                            if(checkCleave(source)){
                                Game.actions.push("cleave");
                            }
                        }
                        if(Game.user.actor.classType.name === "Rogue" && checkSneak(x, y)){
                            // TODO
                            // Game.actions should actually store objects with names and targets
                            Game.actions.push("sneakAttack");
                        }
                    }
                }
            }
            if(Game.user.equipped.name && Game.user.equipped.weaponType === "Ranged"){
                let radius = rangedRadius(Math.floor(Game.user.equipped.range / 10));
                // TODO finish this function
            }
            if(Game.user.actor.classType.name === "Sorcerer"){
                Game.actions.push("castSpell");
            }
            if(Game.user.actor.classType.name === "Cleric"){
                Game.actions.push("castSpell");
            }
        }
    }
    // end Game.actionOptions()



    // available if the player does not have a weapon equipped.
    // player chooses a weapon that they have in their inventory and it is set to equipped
    Game.drawWeapon = (source, weapon) => {

        if(checkUser(source)){
            Game.user.equipped = {
                name: weapon.name
                , weaponType: weapon.weaponType
                , prof: weapon.proficiency
                , range: weapon.range
                , crit: {
                    critRange: weapon.crit.critRange
                    , critDamage: weapon.crit.damageMultiplier
                }
            }
            if(Game.user.size === "medium"){
                Game.user.equipped.damage = {
                    diceType: weapon.damage.medium.diceType
                    , numDice: weapon.damage.medium.numOfDice
                }
            }
            if(Game.user.size === "small"){
                Game.user.equipped.damage = {
                    diceType: weapon.damage.small.diceType
                    , numDice: weapon.damage.small.numOfDice
                }
            }
            Game.turnOver = true;
            socket.emit("drawWeapon", {source: source, weapon: weapon, room: room});        // TODO

        } else {
            for(let i = 0; i < Game.players.length; i++){
                if(Game.board[source.x][source.y].id === Game.players[i].id){
                    Game.players[i].equipped.name = weapon.name;
                }
            }
        }

    }

    // available if the player already has a weapon equipped
    // player.equipped = {}
    Game.sheathWeapon = (source) => {
        if(checkUser(source)){
            Game.user.equipped = {};
            Game.turnOver = true;
            socket.emit("sheathWeapon", {source: source, room: room});          // TODO
        } else {
            for(let i = 0; i < Game.players.length; i++){
                if(Game.board[source.x][source.y].id === Game.players[i].id){
                    Game.players[i].equipped = {};
                }
            }
        }

    }

    // available if a door is next to the user, ie. directly above, beneath, left or right
    // door opens if not locked
    Game.openDoor = (source, target) => {
        if(Game.board[target.x][target.y].door.locked){
            socket.emit("openDoor", {source: source, target: target, success: false, room: room});   // TODO openDoor: back and front(controller)
            return false;
        }
        Game.board[target.x][target.y].door.open = true;
        socket.emit("openDoor", {source: source, target: target, success: true, room: room});       // TODO openDoor: back and front(controller)
        return true;
    }

    // break down a door if locked or stuck
    Game.bash = (source, target) => {
        let x = target.x, y = target.y;
        if(checkUser(source)){
            let strMod  = statMod(Game.user.actor.baseStats.str);
            let roll    = dice.roll20();                                        // TODO DICEROLL
            let success = (roll + strMod) >= Game.board[x][y].door.bashDC;
            let crit    = false;
            if(roll >= Game.user.equippped.crit.critRange){
                success = true;
                crit    = true;
            }
            let damage  = 0;
            if(success){
                let die = Game.user.equipped.damage.diceType;
                let numDice = Game.user.equipped.damage.numDice;                // TODO DICEROLL
                for(let i = 0; i < numDice; i++){
                    damage += (Math.floor(Math.random(Game.user.equipped.damage.diceType))) + 1;
                }
                damage += strMod;
                if(crit){
                    damage *= 2;
                }
                // Game.board[x][y].door.hp -= damage;  // TODO in ctrl
                // if(Game.board[x][y].door.hp <= 0){
                //     Game.board[x][y].door.open = true;
                // }
            }
            Game.turnOver = true;
            socket.emit("bash", {source: source                                 // TODO socket.on("bash") controller side
                                , target: target
                                , roll: roll
                                , success: success
                                , damage: damage
                                , crit: crit
                                , room: room
                            });
        }
    }

    // available if a door is next to the user, ie. directly above, beneath, left or right
    Game.closeDoor = (source, target) => {
        // Game.board[target.x][target.y].door.open = false;    // TODO ctrl
        socket.emit("closeDoor", {source: source, target: target, room: room}); // TODO socket.on("closeDoor") controller side
    }

    Game.perception = (source) => {
        // TODO requires radius function
        // always available during explore
        // search for secrets, items or monsters in a 2 square radius
        // modifier is based on wis scores
        let ranged = rangedRadius(Game.user.location, 2);
        let found  = [];
        let rand   = Math.floor(Math.random() * 20) + 1;                        // TODO DICEROLL
        let wis    = statMod(Game.user.actor.bastStats.wis);
        for(let i = 0; i < ranged.length; i++){
            let x = ranged[i][0], y = ranged[i][1];
            if(Game.board[x][y].item.items.length > 0){
                if(rand === 20 || ((rand + wis) >= Game.board[x][y].item.findDC)){
                    found.push([x, y]);              // pushes the coordinates on found items to be emitted by socket
                    // Game.board[x][y].item.found = true;      // TODO ctrl on listener
                }
            }
        }
        Game.turnOver = true;
        socket.emit("perception", {source: source, roll: rand, found: found, room: room});      // TODO socket.on perception comtroller side
    }

    // available if player is a rogue and next to a door that is locked
    Game.rogueLockpick = (source, target) => {
        let x       = target.x, y = target.y;
        let dc      = Game.board[x][y].door.pickDC;
        let rand    = Math.floor(Math.random() * 20) + 1;                       // TODO DICEROLL
        let int     = statMod(Game.user.actor.baseStats.int);
        let lvl     = Game.user.actor.totalLvl;
        let success = false;
        if(rand === 20 || ((rand + int + lvl) >= dc)){
            success = true;
            // Game.board[x][y].door.locked = false;        // TODO put on the on listener the on ctrl
        }
        Game.turnOver = true;
        socket.emit("rogueLockpick", {source: source, target: target, roll: rand, success: success, room: room});
    }

    // available if player is a rogue and the gameState is explore
    Game.rogueTrapfind = (source) => {
        let ranged = rangedRadius(Game.user.location);
        let wis    = statMod(Game.user.actor.baseStats.wis);
        let rand   = Math.floor(Math.random() * 20) + 1;                        // TODO DICEROLL
        let lvl    = Game.user.actor.level;
        let found = [];
        for(let i = 0; i < ranged.length; i++){
            let x = ranged[i][0], y = ranged[i][1];
            if(Game.board[x][y].trap.name){
                if(roll === 20 || ((rand + wis + lvl) >= Game.board[x][y].trap.findDC)){
                    found.push([x, y]);
                    // Game.board[x][y].trap.found = true; // TODO put on the on listener in the ctrl
                }
            }
        }
        Game.turnOver = true;
        socket.emit("rogueTrapfind", {source: source, roll: rand, found: found, room: room});   // TODO socket.on rogueTrapFind controller side
    }

    // available if the player is a rogue and is next to a trap that has been found
    Game.rogueDisarmTrap = (source, target) => {
        let x       = target.x, y = target.y;
        let int     = statMod(Game.user.actor.baseStats.int);
        let lvl     = Game.user.actor.level;
        let rand    = Math.floor(Math.random() * 20) + 1;                        // TODO DICEROLL
        let damage  = 0;
        let success = true;
        if(rand !== 20 || (int + lvl + rand) < Game.board[x][y].trap.disarmDC){
            success = false;
            for(let i = 0; i < Game.board[x][y].trap.damage.numDice; i++){
                damage += (Math.floor(Math.random() * Game.board[x][y].trap.damage.diceType) + 1); // TODO DICEROLL
                damage += Game.board[x][y].trap.damage.mod;
                damage /= 2;
            }
        }
        // Game.board[x][y].trap.triggered = true;
        // TODO SOCKETTYS
        socket.emit("rogueDisarmTrap", {source: Game.user.location, roll: rand, damage: damage, success: success, room: room});
    }

    // available if item on square is found through successful perception and character is on the square
    Game.pickUpItem = (source) => {
        let x = Game.user.location.x, y = Game.user.location.y;
        for(let i = 0; i < Game.board[x][y].item.items.length; i++){
            Game.user.items.push(Game.board[x][y].item.items[i]);
        }
        socket.emit("pickUpItem", {source: Game.user.location, item: item, room: room});
    }

    // available in explore mode. Item that is dropped is marked as found.
    Game.dropItem = (item) => {
        socket.emit("dropItem", {source: Game.user.location, item: item, room: room});
    }

    // combat options
    // available if an enemy is next to the player
    Game.melee = (source, target) => {

        socket.emit("melee", {source: Game.user.location, target: target, roll: rand, damage: damage, crit: crit, room: room});
    }

    // available if enemies are within an unblocked radius
    Game.ranged = (source, target) => {

        socket.emit("melee", {source: Game.user.location, target: target, roll: rand, damage: damage, crit: crit, room: room});
    }

    // sacrifice accuracy for damage
    Game.fighterPowerAttack = (source, target1, target2) => {

        socket.emit("fighterPowerAttack", {source: Game.user.location, target: target, roll: rand, damage: damage, crit: crit, room: room});
    }

    // can hit an additional enemy if the first is killed
    Game.fighterCleave = (source, target) => {

        socket.emit("fighterCleave", {source: Game.user.location, target1: target1, target2: target2, roll: rand, damage: damage, crit: crit, room: room});
    }

    Game.castSpell = (source, target) => {

        socket.emit("castSpell", {source: Game.user.location, target: target, spell: spell, roll: rand, room: room});
    }

    Game.rogueSneakAttack = (source, target) => {

        socket.emit("rogueSneakAttack", {source: Game.user.location, roll: rand, damage: damage, crit: crit, room: room})
    }

    // checks if target square is available and returns a boolean
    Game.move = (source, target) => {
        if(!Game.board[target.x][target.y].free){
            return false;
        }
        socket.emit("move", {source: Game.user.location, target: target, room: room});
    }

    // GAME FUNCTIONS * * *




    // * * * MAIN INITS

    this.initGame = function(dungeon, players, userCharacter, gameId){  // Players will already exist on the scope by the time the dungeon starts
                                                                      // so players array will not be tied to the Dungeon object.
        for(let k = 0; k < players.length; k++){                      // game room needs to be passes with socket.emit functions
            let rand = generateId();

            if(players[k]._id === userCharacter._id){
                if(players[k].dm){
                    Game.dmMode = true;
                } else {
                    Game.user.actor = userCharacter;                     // Game.user is a character
                    Game.user.location = dungeon.startingLocation[k];    // user exists as an object on service and in the array of players
                    Game.user.id = rand;
                    Game.user.ac = findAC(Game.user.actor);
                    Game.user.hp = userCharacter.hp;
                    Game.user.equipped = {};
                    Game.user.newItems = [];
                }
            } else {
                Game.players.push({
                    actor: players[k].userChar                                    // Game.players[i].actor is a character
                    , location: dungeon.startingLocation[k]
                    , userName: players[k].userName
                    , equipped: {}
                    , id: rand
                    , ac: findAC(players[k].userChar)
                    , hp: players[k].userChar.hp
                    , newItems: []
                });
            }
            Game.exploreOrder.push(players);
        }

        room = gameId;

        Game.monsters = dungeon.monsters;       // Monsters and environment objects already have locations
        Game.environment = dungeon.environment;
        for(let i = 0; i < dungeon.height; i++){
            Game.board.push([]);
            for(let j = 0; j < dungeon.width; j++){
                let square = {
                    free: true
                    , trap: {}
                    , door: {}
                    , item: {
                        items:[]
                    }
                    , type: ""                  // Types are monster, player, or environment
                    , id: ""                    // Unique ids point to the element in the array of one of the three types
                }
                Game.board[y].push(square);
            }
        }
        loadEnvironment();
        loadTraps();
        loadMonsters();
        loadPlayers();
        loadItems();

        printBoard();
    }

    function loadEnvironment(){
        for(let i = 0; i < Game.environment.length; i++){
            let x = Game.environment[i].location.x;
            let y = Game.environment[i].location.y;
            Game.board[x][y].free = false;
            Game.board[x][y].type = "environmental";
            Game.board[x][y].id = Game.environment[i].id;
        }
    }

    function loadTraps(){
        for(let i = 0; i < Game.traps.length; i++){
            let x = dungeon.traps[i].location.x;
            let y = dungeon.traps[i].location.y;
            Game.board[x][y].trap = dungeon.traps[i].trap
        }
    }

    function loadMonsters(){
        for(let i = 0; i < Game.monsters.length; i++){
            Game.monsters[i].id = generateId();
            let x = Game.monsters[i].location.x;
            let y = Game.monsters[i].location.y;
            Game.board[x][y].free = false;
            Game.board[x][y].type = "monster";
            Game.board[x][y].name = Game.monsters[i].actor.name;
            Game.board[x][y].id   = Game.monsters[i].id
        }
    }

    function loadPlayers(){
        for(let i = 0; i < Game.players.length; i++){
            Game.players[i].id = generateId();
            let x = Game.players[i].location.x;
            let y = Game.players[i].location.y;
            Game.board[x][y].free = false;
            Game.board[x][y].type = "player";
            Game.board[x][y].name = Game.players[i].actor.name;
            Game.board[x][y].id   = Game.players[i].id
        }
    }

    function loadItems(){
        for(let i = 0; i < dungeon.items.armor.length; i++){
            let x = dungeon.items.armor[i].location.x;
            let y = dungeon.items.armor[i].location.y;
            Game.board[x][y].item.items.push(dungeon.items.armor[i].item);
            Game.board[x][y].item.found = dungeon.items.armor[i].found;
            Game.board[x][y].item.findDC = dungeon.items.armor[i].findDC;
        }
        for(let i = 0; i < dungeon.items.weapons.length; i++){
            let x = dungeon.items.weapons[i].location.x;
            let y = dungeon.items.weapons[i].location.y;
            Game.board[x][y].item.items.push(dungeon.items.weapons[i].item);
            Game.board[x][y].item.found = dungeon.items.weapons[i].found;
            Game.board[x][y].item.findDC = dungeon.items.weapons[i].findDC;
        }
        for(let i = 0; i < dungeon.items.gear.length; i++){
            let x = dungeon.items.gear[i].location.x;
            let y = dungeon.items.gear[i].location.y;
            Game.board[x][y].item.items.push(dungeon.items.gear[i].item);
            Game.board[x][y].item.found = dungeon.items.gear[i].found;
            Game.board[x][y].item.findDC = dungeon.items.gear[i].findDC;
        }
    }

    function generateId(){
        while(true){
            let rand = Math.floor(Math.random() * 10000);
            if(Game.ids.indexOf(rand) === -1){
                Game.ids.push(rand);
                return rand.toString();
            }
        }
    }

    // * * * PRINTBOARD

    function printBoard(){
        for(let x = 0; x < Game.width; x++){
            let line = "";
            for(let y = 0; y < Game.height; y++){
                if(Game.board[x][y].items.length > 0){
                    line += " I";
                } else if(Game.board[x][y].trap.name){
                    line += " T";
                } else if(Game.board[x][y].type === "player"){
                    line += " P";
                } else if(Game.board[x][y].type === "monster"){
                    line += " M";
                } else if(Game.board[x][y].type === "environmental"){
                    line += " E";
                } else {
                    line += " .";
                }
            }
            console.log(line);
        }
    }

    // MAIN INITS * * *



    // * * * OTHER FUNCTIONS

    // Checks if the rogue's sneak attack option is available
    // A rogue can sneak attack when the monster he is attacking is touching two or more players, including the rogue himself
    function checkSneak(target){
        let count = 0;
        let adjacent = findAdjacent(target);
        for(let i = 0; i < adjacent.length; i++){
            let x = adjacent[i][0], y = adjacent[i][1];
            if(Game.board[x][y].type === "player"){
                count++;
            }
        }
        return count > 1;
    }

    // A fighter can use cleave when he is surrounded by two or more monsters
    function checkCleave(source){
        let count = 0;
        let adjacent = findAdjacent(source);
        for(let i = 0; i < adjacent.length; i++){
            let x = adjacent[i][0], y = adjacent[i][1];
            if(Game.board[x][y].type === "monster"){
                count++;
            }
        }
        return count > 1
    }

    function findAdjacent(source){
        return [
              [source.x - 1, source.y - 1]
            , [source.x - 1, source.y    ]
            , [source.x - 1, source.y + 1]
            , [source.x    , source.y - 1]
            , [source.x    , source.y + 1]
            , [source.x + 1, source.y - 1]
            , [source.x + 1, source.y    ]
            , [source.x + 1, source.y + 1]
        ];
    }



    function rangedRadius(source, range){
        let x = source.x, y = source.y;
        let ranged = [];
        for(let i = (x - range); i < (x + range); i++){
            for(let j = (y - range); j < (y + range); j++){
                ranged.push([i, j]);
            }
        }
        return ranged;
    }

    function checkUser(source){
        return Game.board[source.x][source.y].id === Game.user.id;
    }

    function roll20(mod, dc){
        return (dice.roll20() + mod) >= dc;
    }

    function statMod(stat){
        return Math.floor((Game.user.baseStats[stat] - 10) / 2);
    }

    function findAC(character){
        return (10 + statMod(character.baseStats.dex) + character.armor[0].bonus);
    }

    const dice = {};

    dice.roll3 = () => {
      return Math.floor(Math.random() * 3) + 1
    }
    dice.roll4 = () => {
      return Math.floor(Math.random() * 4) + 1
    }
    dice.roll6 = () => {
      return Math.floor(Math.random() * 6) + 1
    }
    dice.roll8 = () => {
      return Math.floor(Math.random() * 8) + 1
    }
    dice.roll10 = () => {
      return Math.floor(Math.random() * 10) + 1
    }
    dice.roll12 = () => {
      return Math.floor(Math.random() * 12) + 1
    }
    dice.roll20 = () => {
      return Math.floor(Math.random() * 20) + 1
    }


    // OTHER FUNCTIONS * * *

}
