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


    const Game = {
        board: []
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
    Game.actionOptions = (source) => {

        //these actions are unviersal for explore and combat
        let playerId = board[source.x][source.y].id;

        Game.actions = ["draw", "sheath"];

        // All actions that can take place in explore [draw, sheath, openDoor, closeDoor, perception, rogueLockpick, rogueTrapfind, rogueDisarmTrap]

        // checks the immediate squares around the player and returns available options.
        let adjacent = [
              [source.x - 1, source.y - 1]
            , [source.x - 1, source.y    ]
            , [source.x - 1, source.y + 1]
            , [source.x    , source.y - 1]
            , [source.x    , source.y + 1]
            , [source.x + 1, source.y - 1]
            , [source.x + 1, source.y    ]
            , [source.x + 1, source.y + 1]
        ];
        let doorSqr = [                     // doors cannot be opened on the diagonal
              [source.x, source.y - 1]
            , [source.x, source.y + 1]
            , [source.x - 1, source.y]
            , [source.x + 1, source.y]
        ];

        if(gameState === "explore"){
            Game.actions.push("perception");
            for(let i = 0; i < doorSqr.length; i++){
                let x = doorSqr[i][0], y = doorSqr[i][1];
                if(Game.board[x][y].door.id){
                    if(Game.board[x][y].door.open === false){
                        Game.actions.push("openDoor");
                    }
                    if(Game.board[x][y].door.open === true){
                        Game.actions.push("closeDoor");
                    }
                }
            }
        }
    }

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

    Game.closeDoor = (source, target) => {
        // available if a door is next to the user, ie. directly above, beneath, left or right
    }

    Game.perception = (source) => {
        // always available during explore
        // search for secrets, items or monsters in a 4 square radius
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



    // GAME FUNCTIONS * * *




    // * * * MAIN INITS

    this.initGame = function(dungeon, players, userCharacter){  // Players will already exist on the scope by the time the dungeon starts
                                                                // so players array will not be tied to the Dungeon object.
        for(let k = 0; k < players.length; k++){
            if(players[k]._id === userCharacter._id){
                user.actor = userCharacter;
                user.location = dungeon.startingLocation[k];
            }
            Game.players.push({
                actor: players[k]
                , location: dungeon.startingLocation[k]
                , equipped: {}
                , id: generateId()
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
                    , items: []
                    , type: ""
                    , id: ""
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
            Game.board[x][y].items.push(Game.items[i].item);
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

}
