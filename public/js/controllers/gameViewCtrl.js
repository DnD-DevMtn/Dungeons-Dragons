/*
This is the parent ctrl of everything game related. It should talk to the Pixi
engine, the game Engine, and the gameInfo Ctrls.
 */

export default function(engineService, userService, socket, $stateParams, $http, inventoryService, $scope) {
    const GV = this;

    GV.user = userService.user;

    GV.party = $stateParams.party;

    GV.userChar = $stateParams.userChar;

    GV.gameId = $stateParams.gameId;

    GV.dungeon = GV.pixiDungeon = $stateParams.dungeon;

    let Game;

    let currentMonsterClicked = {};

    if($stateParams.dungeon) {
        Game = engineService.initGame(GV.dungeon, GV.party, GV.userChar, GV.gameId);
        GV.pixiDungeon.players = Game.players;
        GV.pixiDungeon.user = Game.user;
        checkTurn();
    }

    socket.on("return move", data => {
        console.log("SOCKET RETURN MOVE", data);
        let source = data.source, target = data.target;
        console.log(Game.user.location);
        if(Game.board[source.y][source.x].id === Game.user.id) {      // TODO in ctrl

            Game.user.location.x = target.x;
            Game.user.location.y = target.y;
        }
        $scope.$broadcast("send move", {character: data.character, target: data.target});

        updateActorPosition(source, target);

        let type = Game.board[source.y][source.x].type;       // save the reference variables
        let id   = Game.board[source.y][source.x].id;

        Game.board[source.y][source.x].type = "";             // set source square props to empty
        Game.board[source.y][source.x].id   = "";
        Game.board[source.y][source.x].free = true;

        Game.board[target.y][target.x].type = type;           // set target square props to actor
        Game.board[target.y][target.x].id   = id;
        Game.board[target.y][target.x].free = false;

        // + + + PIXI MOVE + + + \\
        printBoard();
    });

    socket.on("return bash", data => {
        let x = data.target.x, y = data.target.y;

        if(success) {
            Game.board[y][x].door.hp -= damage;
            if(Game.board[y][x].door.hp <= 0) {
                Game.board[y][x].door.open = true;
            }
        }

        // + + + PIXI BASH ANIMATION DATA.SOURCE + + + \\

        // + + + PIXI DISPLAY DATA.ROLL + + + \\
        if(crit){
            // + + + PIXI DISPLAY CRITICAL + + + \\
        }

        // + + + PIXI DISPLAY DAMAGE + + + \\
    });

    socket.on("return openDoor", data => {
        let x = data.target.x, y = data.target.y;
        Game.board[y][x].door.open = false;

        // + + + PIXI OPEN DOOR + + + \\
    });

    socket.on("return closeDoor", data => {
        let x = data.target.x, y = data.target.y;
        Game.board[y][x].door.open = false;

        // + + + PIXI CLOSE DOOR + + + \\
    });

    socket.on("return perception", data => {

        // + + + PIXI DATA.ROLL + + + \\

        if(data.found.length === 0) {
            // + + + PIXI NOTHING FOUND + + + \\
            return;
        }

        for(let i = 0; i < data.found.length; i++) {
            let x = data.found[i][0], y = data.found[i][1];
            Game.board[y][x].item.found = true;
            break;
        }

        // + + + PIXI FOUND ANIMATION + + + \\
    });

    socket.on("return rogueTrapFind", data => {

        // + + + PIXI DATA.ROLL + + + \\

        if(data.found.length === 0) {
            // + + + PIXI NOTHING FOUND + + + \\
            return;
        }

        for(let i = 0; i < data.found.length; i++) {
            let x = data.found[i][0], y = data.found[i][1];
            Game.board[y][x].trap.found = true;
            break;
        }

        // + + + PIXI FOUND ANIMATION + + + \\
    });

    socket.on("return rogueDisarmTrap", data => {
        let x = data.target.x, y = data.target.y;
        let xx = data.source.x, yy = data.target.y;

        // + + + PIXI DATA.ROLL + + + \\

        // + + + PIXI DATA.SUCCESS success + + + \\

        if(!data.success ){
            // + + + PIXI DATA.SUCCESS failed + + + \\
            // + + + PIXI DATA.DAMAGE + + + \\
            if(Game.board[xx][yy].id === Game.user.id) {
                Game.user.hp -= data.damage;
            }
        }

        Game.board[y][x].trap.triggered = true;

    });

    socket.on("return rogueLockpick", data => {
        let x = data.target.x, y = data.target.y;

        // + + + PIXI DATA.ROLL + + + \\

        if(!success) {
            // + + + PIXI DATA.SUCCESS failed + + + \\
            return;
        }

        // + + + PIXI DATA.SUCCESS success + + + \\
        Game.board[y][x].door.locked = false;

    });

    socket.on("return pickUpItem", data => {
        let x = data.source.x, y = data.source.y;

        // + + + PIXI DATA.ITEM.NAME + + + \\
        if(Game.board[y][x].id === Game.user.id) {
            Game.user.items.push(data.item);
            Game.board[y][x].item = {};
            return;
        }
        for(let i = 0; i < Game.players.length; i++) {
            if(Game.board[y][x].id === Game.players[i].id) {
                Game.players[i].newItems.push(data.item);
                Game.board[y][x].item = {};
                break;
            }
        }

    });

    socket.on("return dropItem", data => {
        let x = data.source.x, y = data.source.y;

        // + + + PIXI DATA.ITEM.NAME + + + \\
        if(Game.board[y][x].id === Game.user.id) {
            Game.board[y][x].item.items.push(data.item);
            // Game.user.items.splice(Game.user.items.indexOf(data.item), 1);   // TODO splice dropped item out of array of new Items;
            return;
        }
        for(let i = 0; i < Game.players.length; i++) {
            if(Game.board[y][x].id === Game.players[i].id) {
                Game.board[y][x].item.items.push(data.item);
                // Game.players[i].newItems.push(data.item);                    // TODO SAME AS ABOVE
                break;
            }
        }

    });

    socket.on("return melee", data => {
        let x = data.target.x, y = data.target.y;

        // + + + PIXI DATA.ROLL (crit?) + + + \\

        // + + + PIXI ANIMATE SOURCE ATTACK + + + \\

        let id   = Game.board[y][x].id;
        let type = Game.board[y][x].type;

        if(type === "monster") {
            for(let i = 0; i < Game.monsters.length; i++) {
                if(id === Game.monsters[i].id) {
                    if(Game.monsters[i].monster.ac <= data.roll || data.crit) {
                        // + + + PIXI HIT + + + \\
                        Game.monsters[i].monster.hp -= damage;
                        if(Game.monsters[i].monster.hp <= 0) {
                            // + + + PIXI DEAD + + + \\
                        }
                    } else {
                        // + + + PIXI MISS + + + \\
                    }
                }
            }
        }

        if(type === "player"){
            if(Game.board[y][x].id === Game.user.id) {
                Game.user
            }
            for(let i = 0; i < Game.players.length; i++) {
                if(id === Game.players[i].id) {
                    if(Game.players[i].monster.ac <= data.roll || data.crit) {
                        // + + + PIXI HIT + + + \\
                        Game.players[i].monster.hp -= damage;
                        if(Game.players[i].monster.hp <= 0) {
                            // + + + PIXI DEAD + + + \\
                        }
                    } else {
                        // + + + PIXI MISS + + + \\
                    }
                }
            }
        }

    });

    socket.on("return fighterPowerAttack", data => {
        let x = data.target.x, y = data.target.y;

        // + + + PIXI POWER ATTACK + + + \\

        // + + + PIXI DATA.ROLL (crit?) + + + \\

        // + + + PIXI ANIMATE SOURCE ATTACK + + + \\

        let id   = Game.board[y][x].id;
        let type = Game.board[y][x].type;
        if(type === "monster"){
            for(let i = 0; i < Game.monsters.length; i++) {
                if(id === Game.monsters[i].id) {
                    if(Game.monsters[i].monster.ac <= data.roll || data.crit) {
                        // + + + PIXI HIT + + + \\
                        Game.monsters[i].monster.hp -= damage;
                        if(Game.monsters[i].monster.hp <= 0) {
                            // + + + PIXI DEAD + + + \\
                        }
                    } else {
                        // + + + PIXI MISS + + + \\
                    }
                }
            }
        }

    });

    socket.on("return fighterCleave", data => {

    });

    socket.on("return castSpell", data => {

    });

    socket.on("return rogueSneakAttack", data => {

    });

    socket.on("rogueTrapFind", data => {

    });

    socket.on("return end turn", () => {
        if((Game.exploreTurn === Game.players.length - 1) && !Game.dmTurn) {
            console.log("DM TURN", Game.dmTurn);
            Game.dmTurn = true;
        } else if((Game.exploreTurn === Game.players.length - 1) && Game.dmTurn) {
            Game.exploreTurn = 0;
        } else {
            Game.exploreTurn++;
        }
        console.log("PLAYER'S TURN", Game.players[Game.exploreTurn].actor.name, Game.exploreTurn);
        checkTurn();
    });

    socket.on("return start combat", order => {
        Game.gameStatus = "combat";
        order.forEach( combatant => {
            Game.combatOrder.push(combatant.actor);
        } );
    });


    function updateActorPosition(source, target) {
        console.log("FROM UPDATE ACTOR", source, target);
        let x = source.x, y = source.y;
        let actorType = Game.board[y][x].type + 's';
        for(let i = 0; i < Game[actorType].length; i++) {
            if(Game[actorType][i].id === Game.board[y][x].id) {
                Game[actorType][i].location.x = target.x;
                Game[actorType][i].location.y = target.y;
            }
        }
    }

    function printBoard() {
        for(let y = 0;  y < Game.height; y++) {
            let line = "";
            for(let x = 0; x < Game.width; x++) {
                if(Game.board[y][x].item.items.length > 0) {
                    line += " I";
                } else if(Game.board[y][x].trap.name) {
                    line += " T";
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
      console.log('moves left', Game.moves);
    }

    GV.endTurn = () => {
        console.log("END TURN");
        socket.emit("end turn", GV.gameId);
    }

    GV.startCombat = () => {
        const combatOrder = getCombatOrder();
        socket.emit("start combat", {room: GV.gameId, order: combatOrder});
    }

    function checkTurn(){
        if(Game.players[Game.exploreTurn].id === Game.user.id) {
            // + + + PIXI YOUR TURN BITCH + + + \\
            console.log("IT'S YOUR TURN!");
            Game.moves = Game.user.actor.speed;
            Game.isTurn = true;
            Game.actionOptions();
        }
        if(Game.dmTurn && Game.dmMode) {
            Game.isTurn = true;
            Game.monsterExplore = 0;
            Game.moves = Game.monsters[Game.monsterExplore].speed
        }
        console.log(`${Game.players[Game.exploreTurn].actor.name} turn`)

    }

    window.addEventListener ( "keydown", downHandler, false );
    window.addEventListener ( "keyup", upHandler, false );

    function downHandler() {
        if ( GV.keyUp  && Game.isTurn && (Game.moves > 0)) {
            GV.keyUp = false;
            let character = (!Game.dmMode) ? Game.user : Game.getMonster();
            if(!Game.dmMode){
                switch( event.keyCode ) {
                    case 37:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x - 1, y: Game.user.location.y }, Game.user ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 38:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y - 1 }, Game.user ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 39:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x + 1, y: Game.user.location.y }, Game.user ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 40:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y + 1 }, Game.user ) ) {
                            Game.actionOptions();
                        }
                        break;
                }
            } else {
                switch( event.keyCode ) {
                    case 37:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x - 1, y: Game.monsters[Game.monsterExplore].location.y }, Game.monsters[Game.monsterExplore] ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 38:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x, y: Game.monsters[Game.monsterExplore].location.y - 1 }, Game.monsters[Game.monsterExplore] ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 39:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x + 1, y: Game.monsters[Game.monsterExplore].location.y }, Game.monsters[Game.monsterExplore] ) ) {
                            Game.actionOptions();
                        }
                        break;
                    case 40:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x, y: Game.monsters[Game.monsterExplore].location.y + 1 }, Game.monsters[Game.monsterExplore] ) ) {
                            Game.actionOptions();
                        }
                        break;
                }
            }
        }
    }

    function upHandler() {
        GV.keyUp = true;
    }


    function getCombatOrder() {
        let order = [];
        Game.players.forEach( player => {
            let roll = rollInit(player.actor.baseStats.dex);
            order.push({actor: player.id, initiative: roll});
        } );
        Game.monsters.forEach( monster => {
            let roll = rollMonsterInit(monster.initiative);
            order.push({actor: monster.id, initiative: roll});
        } );
        return order.sort( (a, b) => {
            return a.initiative - b.initiative;
        } );
    }

    function rollInit(dex) {
        const dexMod = Math.floor((dex - 10) / 2);
        return Math.ceil(Math.random() * 20) + dexMod;
    }

    function rollMonsterInit(initMod) {
        return Math.ciel(Math.random() * 20) + initMod;
    }

    $scope.$on('monster clicked', (event, data) => {
        for(var i = 0; i < Game.monsters.length; i++) {
            if(data.id === Game.monsters[i].id) {
                Game.monsterExplore = i;
                return;
            }
        }
    })


}
