export default function engineService(sockets){

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
        , gameState: "explore"
    }

    this.getGame = function(){
        return Game;
    }


    // * * * GAME FUNCTIONS

    Game.move = function(source, target){

    }

    Game.playerMove = function(source, target){
        
    }



    // GAME FUNCTIONS * * *




    // * * * MAIN INITS

    this.initGame = function(dungeon, party){
        Game.players = party;
        Game.monsters = dungeon.monsters;
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
            let x = Game.environment[i].location[0];
            let y = Game.environment[i].location[1];
            Game.board[x][y].free = false;
            Game.board[x][y].type = "environmental";
            Game.board[x][y].name = Game.environment[i].name;
        }
    }

    function loadTraps(){
        for(let i = 0; i < Game.traps.length; i++){
            let x = Game.traps[i].location[0];
            let y = Game.traps[i].location[1];
            Game.board[x][y].trap = Game.traps[i].trap
        }
    }

    function loadMonsters(){
        for(let i = 0; i < Game.monsters.length; i++){
            Game.monsters[i].id = generateId();
            let x = Game.monsters[i].location[0];
            let y = Game.monsters[i].location[1];
            Game.board[x][y].free = false;
            Game.board[x][y].type = "monster";
            Game.board[x][y].name = Game.monsters[i].actor.name;
            Game.board[x][y].id   = Game.monsters[i].id
        }
    }

    function loadPlayers(){
        for(let i = 0; i < Game.players.length; i++){
            Game.players[i].id = generateId();
            let x = Game.players[i].location[0];
            let y = Game.players[i].location[1];
            Game.board[x][y].free = false;
            Game.board[x][y].type = "player";
            Game.board[x][y].name = Game.players[i].actor.name;
            Game.board[x][y].id   = Game.players[i].id
        }
    }

    function loadItems(){
        for(let i = 0; i < Game.items.length; i++){
            let x = Game.items[i].location[0];
            let y = Game.items[i].location[1];
            Game.board[x][y].items.push(Game.items[i].item);
        }
    }

    function generateId(){
        while(true){
            let rand = Math.floor(Math.random() * 10000);
            if(Game.ids.indexOf(rand) === -1){
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
