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


    }

}
