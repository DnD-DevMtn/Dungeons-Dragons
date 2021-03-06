export default function engineService(socket){

    // this is the dungeon format that will be retrieved from the backend

    // the current user's character needs to be retrieved from the
    let user = {};
    let room;

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
        , activeMonsters: []
        , items: []
        , traps: []
        , environment: []
        , combatOrder: []
        , meleeTargets: []
        , rangedTargets: []
        , exploreTurn: 0
        , monsterExplore: 0
        , combatTurn: 0
        , combatAction: ""
        , ids: []
        , actions: []
        , gameState: "explore"
        , isTurn: false
        , dmMode: false
        , dmTurn: false
        , actionTaken: false
        , moves: 0
    }

    this.getGame = () => {
        return Game;
    }


    // * * * GAME FUNCTIONS

    // all source and target params are objects containing x and y coordinates ie. source = {x: 5, y: 7}

    // explore options
    Game.actionOptions = (monsterSource) => {
        // resets available combat targets after every move
        Game.actions = [];
        Game.meleeTargets  = [];
        Game.rangedTargets = [];
        if(Game.dmMode && Game.gameState === "combat" && !Game.actionTaken) {

            // CHECKS MONSTER ADJACENT SQUARES FOR MELEE OPPURTUNITES
            let monsterAdjacent = findAdjacent(monsterSource);
            let monsterRanged   = rangedRadius(monsterSource, 5);
            console.log('monsterRanged', monsterRanged);
            for(let i = 0; i < monsterAdjacent.length; i++) {
                let y = monsterAdjacent[i][0], x = monsterAdjacent[i][1];
                if(Game.board[y][x].type === "player") {
                    if(Game.actions.indexOf("melee") === -1){
                        Game.actions.push("melee");
                    }
                    Game.meleeTargets.push( Game.board[y][x].id );
                }
            }
            for(let i = 0; i < monsterRanged.length; i++) {
                let y = monsterRanged[i].y, x = monsterRanged[i].x;
                if(Game.board[y][x].type === "player") {
                    if(Game.actions.indexOf("ranged") === -1) {
                        Game.actions.push("ranged");
                    }
                    Game.rangedTargets.push( Game.board[y][x].id );
                }
            }
            return Game.actions;
        } else if ( Game.dmMode && Game.gameState === "explore" ){
            return Game.actions;
        }
        let source = {
            x: Game.user.location.x
            , y: Game.user.location.y
        }

        Game.doorLocation = {};

        // Drop item is a universal action for all states
        Game.actions = ["dropItem"];
        if(Game.board[source.y][source.x].item.items.length > 0 && Game.board[source.y][source.x].item.found){
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
        console.log('source', source)
        console.log('adjacent', adjacent);
        let doorSqr = [                     // doors cannot be opened on the diagonal
              [source.y, source.x - 1]
            , [source.y, source.x + 1]
            , [source.y - 1, source.x]
            , [source.y + 1, source.x]
        ];

        console.log('doorSqr', doorSqr);
        console.log('Game.gameState', Game.gameState);
        if(Game.gameState === "explore") {
            Game.actions.push("perception");
            for(let i = 0; i < doorSqr.length; i++) {
                let y = doorSqr[i][0], x = doorSqr[i][1];
                console.log('gameBoard', Game.board[y][x]);
                if(Game.board[y][x].door.hp) {
                    if(!Game.board[y][x].door.open) {
                        Game.doorLocation = { x: x, y: y };
                        Game.actions.push("openDoor");
                        if(Game.user.equipped.name && Game.user.equipped.weaponType !== "Ranged") {
                            Game.actions.push("bash");
                        }
                        if(Game.user.actor.classType.name === "Rogue" && Game.board[y][x].door.locked) {
                            Game.actions.push("lockpick");
                        }
                    }
                    if(Game.board[y][x].door.open) {
                        Game.doorLocation = { x: x, y: y };
                        Game.actions.push("closeDoor");
                    }
                }
            }
        }

        if(Game.gameState === "combat") {
            if(Game.user.equipped.name && Game.user.equipped.weaponType !== "Ranged") {
                for(let i = 0; i < adjacent.length; i++) {
                    let y = adjacent[i][0], x = adjacent[i][1];
                    if(Game.board[y][x].type === "monster") {
                        // If there are multiple targets, this stops melle from being push multiple times
                        if(Game.actions.indexOf("melee") === -1){
                            Game.actions.push("melee");
                        }
                        // maintains a list of valid targets
                        Game.meleeTargets.push( Game.board[y][x].id );

                        if(Game.user.actor.classType.name === "Fighter") {
                            Game.actions.push("fighterPowerAttack");
                            if(checkCleave(source)) {
                                Game.actions.push("cleave");
                            }
                        }
                        if(Game.user.actor.classType.name === "Rogue" && checkSneak(x, y)) {
                            // TODO
                            // Game.actions should actually store objects with names and targets
                            Game.actions.push("sneakAttack");
                        }
                    }
                }
            }
            if(Game.user.equipped.name && Game.user.equipped.weaponType === "Ranged") {
                let radius = rangedRadius(Game.user.location, Math.floor(Game.user.equipped.range / 10));
                for(let i = 0; i < radius.length; i++){
                    if(Game.board[y][x].type === "monster"){
                        if(Game.actions.indexOf("ranged") === -1){
                            Game.actions.push("ranged");
                        }
                        Game.rangedTargets.push( { x: x, y: y } );
                    }
                }
            }
            if(Game.user.actor.classType.name === "Sorcerer") {
                Game.actions.push("castSpell");
            }
            if(Game.user.actor.classType.name === "Cleric") {
                Game.actions.push("castSpell");
            }
        }
        return Game.actions;
    }
    // end Game.actionOptions()

    // available if a door is next to the user, ie. directly above, beneath, left or right
    // door opens if not locked
    Game.openDoor = (source, target) => {
        console.log('open door fired');
        if(Game.board[target.y][target.x].door.locked){
            socket.emit("openDoor", {source, target, success: false, room});
            return false;
        }
        Game.board[target.y][target.x].door.open = true;
        socket.emit("openDoor", {source, target, success: true, room});
        return true;
    }

    // break down a door if locked or stuck
    Game.bash = (source, target) => {
        console.log('bash fired in Game');
        const basher = Game.user.actor.name;
        let x = target.x, y = target.y;
        let strMod  = statMod(Game.user.actor.baseStats.str);
        let roll    = dice.roll20();
        let success = (roll + strMod) >= Game.board[y][x].door.bashDC;
        let crit    = false;
        if(roll >= Game.user.equipped.crit.critRange){
            success = true;
            crit    = true;
        }
        let damage  = 0;
        if(success){
            let die = Game.user.equipped.damage.diceType;
            let numDice = Game.user.equipped.damage.numDice;
            for(let i = 0; i < numDice; i++){
                damage += (Math.floor(Math.random() * die)) + 1;
            }
            damage += strMod;
            if(crit){
                damage *= Game.user.equipped.crit.critDamage;
            }
        }
        Game.actionTaken = true;
        Math.floor(Game.moves /= 2);
        socket.emit("bash", {source: source
                            , target: target
                            , roll: roll
                            , success: success
                            , damage: damage
                            , crit: crit
                            , room: room
                        });
    }

    // available if a door is next to the user, ie. directly above, beneath, left or right
    Game.closeDoor = (source, target) => {
        // Game.board[target.y][target.x].door.open = false;    // TODO ctrl
        socket.emit("closeDoor", {source: source, target: target, basher: basher, room: room}); // TODO socket.on("closeDoor") controller side
    }

    Game.perception = (source) => {
        // TODO requires radius function
        // always available during explore
        // search for secrets, items or monsters in a 2 square radius
        // modifier is based on wis scores
        let ranged = rangedRadius(Game.user.location, 2);
        let found  = [];
        let rand   = Math.floor(Math.random() * 20) + 1;
        let wis    = statMod(Game.user.actor.bastStats.wis);
        for(let i = 0; i < ranged.length; i++){
            let x = ranged[i][0], y = ranged[i][1];
            if(Game.board[y][x].item.items.length > 0){
                if(rand === 20 || ((rand + wis) >= Game.board[y][x].item.findDC)){
                    found.push({x: x, y: y});              // pushes the coordinates on found items to be emitted by socket
                }
            }
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("perception", {source: source, roll: rand, found: found, room: room});
    }

    // available if player is a rogue and next to a door that is locked
    Game.rogueLockpick = (source, target) => {
        let x       = target.x, y = target.y;
        let dc      = Game.board[y][x].door.pickDC;
        let rand    = Math.floor(Math.random() * 20) + 1;
        let int     = statMod(Game.user.actor.baseStats.int);
        let lvl     = Game.user.actor.totalLvl;
        let success = false;
        if(rand === 20 || ((rand + int + lvl) >= dc)){
            success = true;
        }
        Game.actionTaken = true;
        socket.emit("rogueLockpick", {source: source, target: target, roll: rand, success: success, room: room});
    }

    // available if player is a rogue and the gameState is explore
    Game.rogueTrapfind = (source) => {
        let ranged = rangedRadius(Game.user.location, 3);
        let wis    = statMod(Game.user.actor.baseStats.wis);
        let roll   = Math.floor(Math.random() * 20) + 1;
        let lvl    = Game.user.actor.level;
        let found = [];
        for(let i = 0; i < ranged.length; i++){
            let x = ranged[i][0], y = ranged[i][1];
            if(Game.board[y][x].trap.name){
                if(roll === 20 || ((roll + wis + lvl) >= Game.board[y][x].trap.findDC)){
                    found.push({x: x, y: y});
                }
            }
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("rogueTrapfind", {source, roll, found, room});
    }

    // available if the player is a rogue and is next to a trap that has been found
    Game.rogueDisarmTrap = target => {
        let x       = target.x, y = target.y;
        let int     = statMod(Game.user.actor.baseStats.int);
        let lvl     = Game.user.actor.level;
        let roll    = Math.floor(Math.random() * 20) + 1;
        let damage  = 0;
        let success = true;
        if(roll !== 20 || (int + lvl + roll) < Game.board[y][x].trap.disarmDC){
            success = false;
            for(let i = 0; i < Game.board[y][x].trap.damage.numDice; i++){
                damage += (Math.floor(Math.random() * Game.board[y][x].trap.damage.diceType) + 1);
                damage += Game.board[y][x].trap.damage.mod;
                damage /= 2;
            }
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("rogueDisarmTrap", {source: Game.user.location, roll, damage, success, room});
    }

    // available if item on square is found through successful perception and character is on the square
    Game.pickUpItem = source => {
        let x = Game.user.location.x, y = Game.user.location.y;
        for(let i = 0; i < Game.board[y][x].item.items.length; i++){
            Game.user.items.push(Game.board[y][x].item.items[i]);
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("pickUpItem", {source: Game.user.location, item: item, room: room});
    }

    // available in explore mode. Item that is dropped is marked as found.
    Game.dropItem = (item) => {
        socket.emit("dropItem", {source: Game.user.location, item: item, room: room});
    }

    // combat options
    // available if an enemy is next to the player
    // Game.melee is a function available to the user and monsters
    // TODO GAME.RANGED AND GAME.MELEE CAN BE COMBINED INTO ONE FUNCTION AT SOME POINT
    Game.melee = (source, target) => {
        console.log('melee fired');
        let x = source.x, y = source.y;
        let roll      = Math.floor(Math.random() * 20) + 1;
        let damage    = 0;
        let crit      = (roll === 20) ? true : false;
        let critMod   = 2;
        let attacker  = "";
        let attackMod = 0;
        if(Game.board[y][x].id === Game.user.id){
            attacker  = Game.user.actor.name;
            attackMod = Game.user.actor.baseAttack[0] + statMod(Game.user.actor.baseStats.str);
            if(roll >= Game.user.equipped.crit.critRange) { crit = true; }
            critMod = Game.user.equipped.crit.critDamage;
            for(let i = 0; i < Game.user.equipped.damage.numDice; i++){
                damage += (Math.floor(Math.random() * Game.user.equipped.damage.diceType) + 1);
            }
            damage += statMod(Game.user.actor.baseStats.str);
        }
        if(Game.board[y][x].type === "monster"){
            for(let i = 0; i < Game.monsters.length; i++){
                if(Game.monsters[i].id === Game.board[y][x].id){
                    attacker  = Game.monsters[i].settings.name;
                    attackMod = Game.monsters[i].settings.melee.toHit;
                    for(let j = 0; j < Game.monsters[i].settings.melee.damage.numDice; j++){
                        damage += (Math.floor(Math.random() * Game.monsters[i].settings.melee.damage.diceType) + 1);
                    }
                    damage += Game.monsters[i].settings.melee.damage.mod;
                }
            }
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("melee", {source, target, roll, damage, crit, critMod, attackMod, attacker, room});
    }

    // available if enemies are within an unblocked radius
    Game.ranged = (source, target) => {
        let x = source.x, y = source.y;
        let roll      = Math.floor(Math.random() * 20) + 1;
        let damage    = 0
        let crit      = (roll === 20) ? true : false;
        let critMod   = 2;
        let attacker  = "";
        let attackMod = 0;
        if(Game.board[y][x].id === Game.user.id){
            if(roll >= Game.user.equipped.crit.critRange) { crit = true; }
            critMod   = Game.user.equipped.crit.critDamage;
            attacker  = Game.user.actor.name;
            attackMod = Game.user.actor.baseAttack[0] + statMod(Game.user.actor.baseStats.dex);
            for(let i = 0; i < Game.user.equipped.damage.numDice; i++){
                damage += (Math.floor(Math.random() * Game.user.equipped.damage.diceType) + 1);
            }
        }
        if(Game.board[y][x].type === "monster"){
            for(let i = 0; i < Game.monsters.length; i++){
                if(Game.monsters[i].id === Game.board[y][x].id){
                    attacker  = Game.monsters[i].settings.name;
                    attackMod = Game.monsters[i].settings.ranged.toHit;
                    for(let j = 0; j < Game.monsters[i].settings.ranged.damage.numDice; j++){
                        damage += (Math.floor(Math.random() * Game.monsters[i].settings.ranged.damage.diceType) + 1);
                    }
                    damage += Game.monsters[i].settings.ranged.damage.mod;
                }
            }
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("ranged", {source, target, roll, damage, crit, critMod, attackMod, attacker, room});
    }

    // sacrifice accuracy for damage
    Game.fighterPowerAttack = (source, target1, target2) => {
        let x = source.x, y = source.y;
        let roll    = Math.floor(Math.random() * 20) + 1;
        let damage  = 0;
        let crit    = (roll === 20) ? true : false;
        let critMod = 2;
        if(Game.board[y][x].id === Game.user.id){
            if(roll >= Game.user.equipped.crit.critRange) { crit = true; }
            let critMod = Game.user.equipped.crit.critDamage;
            for(let i = 0; i < Game.user.equipped.damage.numDice; i++){
                damage += (Math.floor(Math.random() * Game.user.equipped.damage.diceType) + 1);
            }
            damage += (Game.user.actor.lvl * 3);
        }
        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("fighterPowerAttack", {source: Game.user.location, target, roll, damage, crit, room});
    }

    // can hit an additional enemy if the first is killed
    Game.fighterCleave = target => {

        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("fighterCleave", {source: Game.user.location, target1, target2, roll, damage, crit, room});
    }

    // Sorcerers and Clerics can cast spells
    Game.castSpell = target => {

        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("castSpell", {source: Game.user.location, target, spell, roll, room});
    }

    Game.rogueSneakAttack = target => {

        Game.actionTaken = true;
        Game.moves = 0;
        socket.emit("rogueSneakAttack", {source: Game.user.location, target, roll, damage, crit, room});
    }

    // checks if target square is available and returns a boolean
    Game.move = (source, target, character) => {
        console.log('character inside of move', character);

        if(!Game.board[target.y][target.x].free){
            return false;
        }
        Game.moves--;
        socket.emit("move", {source: source, target: target, room: room, character: character});

        return true;
    }

    Game.dmMoves = () => {

    }

    // GAME FUNCTIONS * * *




    // * * * MAIN INITS

    this.initGame = function(dungeon, players, userCharacter, gameId){  // Players will already exist on the scope by the time the dungeon starts
                                                                       // so players array will not be tied to the Dungeon object.
        for(let k = 0; k < players.length; k++) {                      // game room needs to be passes with socket.emit functions
            //let rand = generateId();
            console.log(k);
            console.log(players[k]);
            if(players[k].player === userCharacter._id) {
                if(players[k].char.name === 'dm') {
                    Game.dmMode = true;
                } else {
                    Game.user.actor    = userCharacter;                     // Game.user is a character
                    Game.user.location = dungeon.startingLocation[k].location;    // user exists as an object on service and in the array of players
                    Game.user.id       = players[k].char._id;
                    Game.user.ac       = findAC(Game.user.actor);
                    Game.user.hp       = userCharacter.hp;
                    Game.user.equipped = {};
                    Game.user.newItems = [];
                    Game.user.napTime  = false;
                    Game.user.youDead  = false;
                }
            }
            if(players[k].char.name !== "dm"){
                Game.players.push({
                    actor: players[k].char                                    // Game.players[i].actor is a character
                    , location: dungeon.startingLocation[k].location
                    , userName: players[k].userName
                    , sprite: players[k].char.sprite
                    , equipped: {}
                    , id: players[k].char._id
                    , ac: findAC(players[k].char)
                    , hp: players[k].char.hp
                    , newItems: []
                    , napTime: false
                    , youDead: false
                });
            }
        }

        room = gameId;

        Game.monsters    = dungeon.monsters;       // Monsters and environment objects already have locations
        Game.environment = dungeon.environment;

        Game.width = dungeon.width;
        Game.height = dungeon.height;

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
                Game.board[i].push(square);
            }
        }
        loadEnvironment();
        loadTraps(dungeon);
        loadMonsters();
        loadPlayers();
        loadItems(dungeon);
        loadDoors(dungeon);

        printBoard();

        return Game;
    }

    function loadEnvironment(){
        for(let i = 0; i < Game.environment.length; i++){
            let x = Game.environment[i].location.x;
            let y = Game.environment[i].location.y;
            Game.board[y][x].free = false;
            Game.board[y][x].type = "environmental";
            Game.board[y][x].id   = Game.environment[i].id;
        }
    }

    function loadTraps(dungeon){
        for(let i = 0; i < dungeon.traps.length; i++){
            let x = dungeon.traps[i].location.x;
            let y = dungeon.traps[i].location.y;
            Game.board[y][x].trap.findDC    = dungeon.traps[i].settings.findDC;
            Game.board[y][x].trap.disarmDC  = dungeon.traps[i].settings.disarmDC;
            Game.board[y][x].trap.found     = dungeon.traps[i].settings.found;
            Game.board[y][x].trap.triggered = dungeon.traps[i].settings.triggered;
            Game.board[y][x].trap.damage = {
              diceType: dungeon.traps[i].settings.damage.diceType
              , diceNum: dungeon.traps[i].settings.damage.diceNum
              , mod: dungeon.traps[i].settings.damage.mod
            }
        }
    }

    function loadMonsters(){
        for(let i = 0; i < Game.monsters.length; i++){
            //Game.monsters[i].id = generateId();
            let x = Game.monsters[i].location.x;
            let y = Game.monsters[i].location.y;
            Game.board[y][x].free = false;
            Game.board[y][x].type = "monster";
            Game.board[y][x].id   = Game.monsters[i].id
        }
    }

    function loadPlayers(){
        for(let i = 0; i < Game.players.length; i++){
            console.log(Game);
            let x = Game.players[i].location.x;
            let y = Game.players[i].location.y;
            Game.board[y][x].free = false;
            Game.board[y][x].type = "player";
            Game.board[y][x].id   = Game.players[i].id
        }
    }

    function loadItems(dungeon){
        for(let i = 0; i < dungeon.items.armor.length; i++){
            let x = dungeon.items.armor[i].location.x;
            let y = dungeon.items.armor[i].location.y;
            Game.board[y][x].item.items.push(dungeon.items.armor[i].item);
            Game.board[y][x].item.found  = dungeon.items.armor[i].settings.found;
            Game.board[y][x].item.findDC = dungeon.items.armor[i].settings.findDC;
        }
        for(let i = 0; i < dungeon.items.weapons.length; i++){
            let x = dungeon.items.weapons[i].location.x;
            let y = dungeon.items.weapons[i].location.y;
            Game.board[y][x].item.items.push(dungeon.items.weapons[i].item);
            Game.board[y][x].item.found  = dungeon.items.weapons[i].settings.found;
            Game.board[y][x].item.findDC = dungeon.items.weapons[i].settings.findDC;
        }
        for(let i = 0; i < dungeon.items.gear.length; i++){
            let x = dungeon.items.gear[i].location.x;
            let y = dungeon.items.gear[i].location.y;
            Game.board[y][x].item.items.push(dungeon.items.gear[i].item);
            Game.board[y][x].item.found  = dungeon.items.gear[i].settings.found;
            Game.board[y][x].item.findDC = dungeon.items.gear[i].settings.findDC;
        }
    }

    function loadDoors(dungeon){
        for(let i = 0; i < dungeon.doors.length; i++){
            let x = dungeon.doors[i].location.x;
            let y = dungeon.doors[i].location.y;
            Game.board[y][x].door.bashDC = dungeon.doors[i].settings.bashDC;
            Game.board[y][x].door.hp     = dungeon.doors[i].settings.hp;
            Game.board[y][x].door.locked = dungeon.doors[i].settings.locked;
            Game.board[y][x].door.pickDC = dungeon.doors[i].settings.pickDC;
            Game.board[y][x].door.open   = dungeon.doors[i].settings.open;
            if(!Game.board[y][x].door.open) {
              Game.board[y][x].free = false;
            }
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
        for(let y = 0; y < Game.height; y++){
            let line = "";
            for(let x = 0; x < Game.width; x++){
                if(Game.board[y][x].item.items.length > 0){
                    line += " I";
                } else if(Game.board[y][x].trap.findDC) {
                    line += " T";
                } else if(Game.board[y][x].door.bashDC) {
                    line += " D";
                } else if(Game.board[y][x].type === "player") {
                    line += " P";
                } else if(Game.board[y][x].type === "monster") {
                    line += " M";
                } else if(Game.board[y][x].type === "environmental") {
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
            let y = adjacent[i][0], x = adjacent[i][1];
            if(Game.board[y][x].type === "player"){
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
            let y = adjacent[i][0], x = adjacent[i][1];
            if(Game.board[y][x].type === "monster"){
                count++;
            }
        }
        return count > 1
    }

    function findAdjacent(source){
        return [
              [source.y - 1, source.x - 1]
            , [source.y - 1, source.x    ]
            , [source.y - 1, source.x + 1]
            , [source.y    , source.x - 1]
            , [source.y    , source.x + 1]
            , [source.y + 1, source.x - 1]
            , [source.y + 1, source.x    ]
            , [source.y + 1, source.x + 1]
        ];
    }


    // Returns all the board squares within
    function rangedRadius(source, range){
        console.log('ranged radius fired');
        let x = source.x, y = source.y;
        let ranged = [];
        for(let i = (y - range); i < (y + range); i++){
            for(let j = (x - range); j < (x + range); j++){
                ranged.push({y: i, x: j});
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
        return Math.floor((stat - 10) / 2);
    }

    //initiative = stateMod(dex);

    function findAC(character){
        return (10 + Math.floor((character.baseStats.dex - 10) / 2) + character.armor[0].bonus);
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
