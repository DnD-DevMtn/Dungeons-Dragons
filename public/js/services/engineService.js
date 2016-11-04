export default function engineService(sockets){

    // this is the dungeon format that will be retrieved from the backend

    // the current user's character needs to be retrieved from the
    let user = {};

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

        // All actions that can take place in explore [draw, sheath, openDoor, closeDoor, perception, rogueLockpick, rogueTrapfind, rogueDisarmTrap]

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
                        Game.actions.push("openDoor", "bash");
                        if(Game.user.actor.class.name === "rogue" && Game.board[x][y].door.locked === true){
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
                        if(user.actor.class.name === "fighter"){
                            Game.actions.push("fighterPowerAttack");
                            if(checkCleave(source)){
                                Game.actions.push("cleave");
                            }
                        }
                        if(Game.user.actor.class.name === "rogue" && checkSneak(Game.board[x][y])){
                            // TODO
                            // Game.actions should actually store objects with names and targets
                            Game.actions.push("sneakAttack");
                        }
                    }
                }
            }
            if(Game.user.equipped.name && Game.user.equipped.weaponType === "Ranged"){
                let rangedRadius(Math.floor(Game.user.equipped.range / 10));
            }
        }
    }
    // end Game.actionOptions()



    Game.drawWeapon = (source) => {
        // available if the player does not have a weapon equipped.
        // player choose a weapon that they have in their inventory and it is set to equipped
    }

    Game.sheathWeapon = (source) => {
        // available if the player already has a weapon equipped
        // player.equipped = {}
    }

    Game.openDoor = (source, target) => {
        // available if a door is next to the user, ie. directly above, beneath, left or right
        // door opens if not locked
    }

    Game.bash = (source, target) => {
        // break down a door if locked or stuck
    }

    Game.closeDoor = (source, target) => {
        // available if a door is next to the user, ie. directly above, beneath, left or right
    }

    Game.perception = (source) => {
        // always available during explore
        // search for secrets, items or monsters in a 4 square radius
        // modifier is based on wis scores
    }

    Game.rogueLockpick = (source, target) => {
        // available if player is a rogue and next to a door that is locked
    }

    Game.rogueTrapfind = (source) => {
        // available if player is a rogue and the gameState is explore
    }

    Game.rogueDisarmTrap = (source, target) => {
        // available if the player is a rogue and is next to a trap that has been found
    }

    Game.move = (source, target) => {

    }

    Game.pickUpItem = (source) => {
        // available if item on square is found through successful perception and character is on the square
    }

    Game.dropItem = (source) => {
        // available in explore mode. Item that is dropped is marked as found.
    }

    // combat options
    Game.melee = (source, target) => {
        // available if an enemy is next to the player
    }

    Game.ranged = (source, target) => {
        // available if enemies are within an unblocked radius
    }

    Game.fighterPowerAttack = (source, target) => {
        // sacrifice accuracy for damage
    }

    Game.fighterCleave = (source, target) => {
        // can hit an additional enemy if the first is killed
    }

    Game.castSpell = (source, target) => {

    }

    Game.rogueSneakAttack = (source, target) => {

    }

    // checks if target square is available and returns a boolean
    Game.move = (source, target) => {
        if(!Game.board[target.x][target.y].free){
            return false;
        }
        if(Game.board[source.x][source.y].id === Game.user.id){
            Game.user.location.x = target.x;
            Game.user.location.y = target.y;
        } else {
            updateActorPosition(source, target);
        }

        let type = Game.board[source.x][source.y].type;       // save the reference variables
        let id   = Game.board[source.x][source.y].id;

        Game.board[source.x][source.y].type = "";             // set source square props to empty
        Game.board[source.x][source.y].id   = "";
        Game.board[source.x][source.y].free = true;

        Game.board[source.x][source.y].type = type;           // set target square props to actor
        Game.board[source.x][source.y].id   = id;
        Game.board[source.x][source.y].free = false;
    }

    // GAME FUNCTIONS * * *




    // * * * MAIN INITS

    this.initGame = function(dungeon, players, userCharacter){  // Players will already exist on the scope by the time the dungeon starts
                                                                // so players array will not be tied to the Dungeon object.
        for(let k = 0; k < players.length; k++){
            let rand = generateId();
            if(players[k]._id === userCharacter._id){
                Game.user.actor = userCharacter;
                Game.user.location = dungeon.startingLocation[k];    // user exists as an object on service and in the array of players
                Game.user.id = rand;
                Game.user.equipped = {};
            }
            Game.players.push({
                actor: players[k]
                , location: dungeon.startingLocation[k]
                , equipped: {}
                , id: rand
            });
        }

        Game.monsters = dungeon.monsters;       // Monsters and environment objects already have locations
        Game.environment = dungeon.environment;
        for(let i = 0; i < dungeon.height; i++){
            Game.board.push([]);
            for(let j = 0; j < dungeon.width; j++){
                let square = {
                    free: true
                    , trap: {}
                    , door: {}
                    , items: { stuff: [] }
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
            let x = Game.traps[i].location.x;
            let y = Game.traps[i].location.y;
            Game.board[x][y].trap = Game.traps[i].trap
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
        for(let i = 0; i < Game.items.length; i++){
            let x = Game.items[i].location.x;
            let y = Game.items[i].location.y;
            Game.board[x][y].items.stuff.push(Game.items[i].item);
        }
    }

    function generateId(){
        while(true){
            let rand = Math.floor(Math.random() * 10000);
            if(Game.ids.indexOf(rand) === -1){
                Game.ids.push(rand);
                return rand;
            }
        }
    }

    // * * * PRINTBOARD

    function printBoard(){
        for(let row = 0; row < Game.width; row++){
            let line = "";
            for(let col = 0; col < Game.height; col++){
                if(Game.board[row][col].items.length > 0){
                    line += " I";
                } else if(Game.board[row][col].trap.name){
                    line += " T";
                } else if(Game.board[row][col].type === "player"){
                    line += " P";
                } else if(Game.board[row][col].type === "monster"){
                    line += " M";
                } else if(Game.board[row][col].type === "environmental"){
                    line += " E";
                } else {
                    line += " ."
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
        if(count > 1){
            return true;
        }
        return false;
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
        if(count > 1){
            return true;
        }
        return false;
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

    function updateActorPosition(source, target){
        for(let i = 0; i < Game[source.type].length; i++){
            if(Game[source.type][i].id === Game.board[source.x][source.y].id){
                Game[source.type][i].location.x = target.x;
                Game[source.type][i].location.y = target.y;
            }
        }
    }

    function rangedRadius(range){
        //TODO
    }


    // OTHER FUNCTIONS * * *

}
