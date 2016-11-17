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
    GV.gameState = "explore";

    GV.activeMonsters;
    GV.actions;
    GV.turn;

    let Game;

    if($stateParams.dungeon) {
        Game = engineService.initGame(GV.dungeon, GV.party, GV.userChar, GV.gameId);
        GV.pixiDungeon.players = GV.party = Game.players;
        GV.pixiDungeon.user = GV.userChar = Game.user;
        checkTurn();
    }


    // + + + + START OF GAME ACTION OPTIONS
    GV.initCombat = () => {
        Game.activeMonsters = [];
        GV.initActive = true;
        console.log('Game state fired, init combat begins');
        Game.gameState = 'initCombat';
    }

    GV.startCombat = () => {
        const combatOrder = getCombatOrder();
        socket.emit("start combat", {room: GV.gameId, order: combatOrder});
    }

    GV.endCombat = () => {
        if(Game.dmMode) {
           socket.emit("end combat", {room: GV.gameId});
        }
    }

    GV.openDoor = () => {
        Game.openDoor(Game.user.location, Game.doorLocation);
    }

    GV.closeDoor = () => {
        Game.closeDoor(Game.user.location, Game.doorLocation);
    }

    GV.openInventory = () => {
        $scope.$broadcast('open inventory')
    }

    GV.takeAction = action => {
        Game.combatAction = action;
    }

    GV.bash = () => {
        Game.bash(Game.user.location, Game.doorLocation);
    }

    GV.drawWeapon = weapon => {
        socket.emit('draw weapon', {source: Game.user.location, weapon: weapon, room: GV.gameId});
    }

    GV.sheathWeapon = () => {
        socket.emit('sheath weapon', {source: Game.user.location, room: GV.gameId});
    }

    GV.endTurn = () => {
        if(Game.isTurn) {
            console.log("ending turn");
            Game.isTurn = false;
            Game.actionTaken = false;
            socket.emit("end turn", GV.gameId);
        }
    }
    // END OF GAME ACTION OPTIONS + + + +


    // + + + + START OF SOCKET ON LISTENERS
    socket.on("return move", data => {
        let source = data.source, target = data.target;
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

        if(Game.isTurn) {
            if(!Game.dmMode) {
                GV.actions = Game.actionOptions();
            } else if(Game.dmMode) {
                GV.actions = Game.actionOptions(target);
            }
            if(Game.actions.includes("openDoor")) {
                GV.openDoor  = true;
                GV.closeDoor = false;
            } else if(Game.actions.includes("closeDoor")) {
                GV.closeDoor = true;
                GV.openDoor  = false;
            } else {
                GV.openDoor  = false;
                GV.closeDoor = false;
            }
            console.log("ACTION OPTIONS", Game.actions);
        }


        // + + + PIXI MOVE + + + \\
        GV.showDamageHitDisplay = true;
        printBoard();
    });

    socket.on("return draw weapon", data => {
        let x = data.source.x, y = data.source.y;
        if(Game.board[y][x].id === Game.user.id) {
            Game.user.equipped = {
                name: data.weapon.name
                , weaponType: data.weapon.weaponType
                , prof: data.weapon.proficiency
                , range: data.weapon.range
                , crit: {
                    critRange: data.weapon.crit.critRange
                    , critDamage: data.weapon.crit.damageMultiplier
                }
            }
            GV.drawnWeapon = data.weapon.name;
        }
        if(Game.user.actor.size === "medium"){
            Game.user.equipped.damage = {
                diceType: data.weapon.damage.medium.diceType
                , numDice: data.weapon.damage.medium.numOfDice
            }
        }
        if(Game.user.actor.size === "small"){
            Game.user.equipped.damage = {
                diceType: data.weapon.damage.small.diceType
                , numDice: data.weapon.damage.small.numOfDice
            }
        }
        Game.actionTaken = true;
        Math.floor(Game.moves /= 2);

        for(let i = 0; i < Game.players.length; i++) {
            if(Game.board[y][x].id === Game.players[i].id) {
                Game.players[i].equipped.name = data.weapon.name;
                break;
            }
        }
        console.log('Game.user.equipped', Game.user.equipped);
    });

    socket.on("return sheath weapon", data => {
        let x = data.source.x, y = data.source.y;
        if(Game.board[y][x].id === Game.user.id) {
            Game.user.equipped = {};
            GV.drawnWeapon = "";
        }
        for(let i = 0; i < Game.players.length; i++) {
            if(Game.board[y][x].id === Game.players[i].id) {
                Game.players[i].equipped = {};
                break;
            }
        }
    });

    socket.on("return bash", data => {
        let x = data.target.x, y = data.target.y;

        GV.attacker = data.basher;
        GV.attack   = true;

        if(data.success) {
            GV.attackResult = "bashed";
            GV.damage       = data.damage;
            Game.board[y][x].door.hp -= data.damage;
            if(Game.board[y][x].door.hp <= 0) {
                Game.board[y][x].door.open = true;
                Game.board[y][x].free      = true;
            }
        } else {
            GV.attackedResult = "missed";
        }
        if(data.crit){

        }
    });

    socket.on("return openDoor", data => {
        console.log('door open returned');
        let x = data.target.x, y = data.target.y;
        Game.board[y][x].door.open = true;
        Game.board[y][x].free = true;

        // + + + PIXI OPEN DOOR + + + \\
    });

    socket.on("return closeDoor", data => {
        let x = data.target.x, y = data.target.y;
        Game.board[y][x].door.open = false;
        Game.board[y][x].free = false;

        // + + + PIXI CLOSE DOOR + + + \\
    });

    socket.on("return perception", data => {

        // + + + PIXI DATA.ROLL + + + \\

        if(data.found.length === 0) {
            // + + + PIXI NOTHING FOUND + + + \\
            return;
        }

        for(let i = 0; i < data.found.length; i++) {
            let x = data.found[i].x, y = data.found[i].y;
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
            let x = data.found[i].x, y = data.found[i].y;
            Game.board[y][x].trap.found = true;
            break;
        }

        // + + + PIXI FOUND ANIMATION + + + \\
    });

    socket.on("return rogueDisarmTrap", data => {
        let x = data.target.x, y = data.target.y;
        let xx = data.source.x, yy = data.source.y;

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

        if(data.crit){
            // change the color of the attack
        }

        let id   = Game.board[y][x].id;
        let type = Game.board[y][x].type;

        // display information
        GV.rollToHit = data.roll + data.attackMod;
        GV.attacker  = data.attacker;
        GV.attack    = true;
        GV.damage    = data.damage;

        // if the target is a monster
        if(type === "monster") {
            for(let i = 0; i < Game.monsters.length; i++) {
                if(id === Game.monsters[i].id) {
                    GV.attacked = Game.monsters[i].settings.name;
                    console.log('monster before', Game.monsters[i]);
                    if(Game.monsters[i].settings.ac <= (data.roll + data.attackMod) || data.crit) {
                        GV.attackResult = "hit";
                        console.log('hit', data.damage);
                        console.log('monster.settings.hp', Game.monsters[i].settings.hp)
                        console.log('monster.settings.hp - damage', Game.monsters[i].settings.hp - data.damage);
                        GV.successfulHit = "HIT";
                        GV.damage        = data.damage;
                        $scope.$broadcast("attack", {source: Game.board[data.source.y][data.source.x], target: Game.monsters[i], damage: data.damage});
                        Game.monsters[i].settings.hp -= data.damage;
                        if(Game.monsters[i].settings.hp <= 0) {
                            $scope.$broadcast("dead", {target: Game.monsters[i]});
                            Game.board[y][x].free = true;
                            Game.board[y][x].id   = "";
                            Game.board[y][x].type = "";
                            if(Game.combatTurn > Game.combatOrder.indexOf(Game.monsters[i].id)) {
                                Game.combatTurn--;
                            }
                            Game.combatOrder.splice(Game.combatOrder.indexOf(Game.monsters[i].id), 1);
                        }
                    } else {
                        GV.attackResult = "missed";
                    }
                }
            }
        }

        // if the target is a player
        if(type === "player") {
            if(Game.board[y][x].id === Game.user.id) {
                console.log('user before', Game.user);
                if(Game.user.ac <= (data.roll + data.attackMod) || data.crit) {
                    GV.attackResult = "hit";
                    console.log('hit', data.damage);
                    console.log('game.user.hp', Game.user.hp)
                    console.log('game.user.hp - damage', Game.user.hp - data.damage);
                    Game.user.hp -= data.damage;
                }
                console.log('user after', Game.user);
            }
            for(let i = 0; i < Game.players.length; i++) {
                if(id === Game.players[i].id) {
                    console.log('player before', Game.players[i]);
                    if(Game.players[i].ac <= (data.roll + data.attackMod) || data.crit) {
                        GV.attacked = Game.players[i].actor.name;
                        console.log('hit', data.damage);
                        console.log('players[i].hp', Game.players[i].hp)
                        console.log('players[i].hp - damage', Game.players[i].hp - data.damage);
                        Game.players[i].settings = {hp: Game.players[i].hp};
                        $scope.$broadcast("attack", {source: Game.board[data.source.y][data.source.x], target: Game.players[i], damage: data.damage});
                        Game.players[i].hp -= data.damage;
                        GV.successfulHit = "HIT";
                        if(Game.players[i].hp <= 0) {
                            $scope.$broadcast("dead", {target: Game.players[i]});
                        }
                    } else {
                        GV.attackResult = "missed";
                        console.log('miss');
                    }
                }
            }
        }
    });

    socket.on("return ranged", data => {
        let x = data.target.x, y = data.target.y;

        if(data.crit){
            // change the color of the attack
        }

        let id   = Game.board[y][x].id;
        let type = Game.board[y][x].type;

        // display information
        GV.rollToHit = data.roll;
        GV.attacker  = data.attacker;
        GV.attack    = true;
        GV.damage    = data.damage;

        // if the target is a monster
        if(type === "monster") {
            for(let i = 0; i < Game.monsters.length; i++) {
                if(id === Game.monsters[i].id) {
                    GV.attacked = Game.monsters[i].settings.name;
                    console.log('monster before', Game.monsters[i]);
                    if(Game.monsters[i].settings.ac <= (data.roll + data.attackMod) || data.crit) {
                        GV.attackResult = "hit";
                        console.log('hit', data.damage);
                        console.log('monster.settings.hp', Game.monsters[i].settings.hp)
                        console.log('monster.settings.hp - damage', Game.monsters[i].settings.hp - data.damage);
                        GV.successfulHit = "HIT";
                        GV.damage        = data.damage;
                        $scope.$broadcast("attack", {source: Game.board[data.source.y][data.source.x], target: Game.monsters[i], damage: data.damage});
                        Game.monsters[i].settings.hp -= data.damage;
                        if(Game.monsters[i].settings.hp <= 0) {
                            $scope.$broadcast("dead", {target: Game.monsters[i]});
                            Game.board[y][x].free = true;
                            Game.board[y][x].id   = "";
                            Game.board[y][x].type = "";
                            if(Game.combatTurn > Game.combatOrder.indexOf(Game.monsters[i].id)) {
                                Game.combatTurn--;
                            }
                            Game.combatOrder.splice(Game.combatOrder.indexOf(Game.monsters[i].id), 1);
                        }
                    } else {
                        GV.attackResult = "missed";
                    }
                }
            }
        }

        // if the target is a player
        if(type === "player") {
            if(Game.board[y][x].id === Game.user.id) {
                console.log('user before', Game.user);
                if(Game.user.ac <= (data.roll + data.attackMod) || data.crit) {
                    GV.attackResult = "hit";
                    console.log('hit', data.damage);
                    console.log('game.user.hp', Game.user.hp)
                    console.log('game.user.hp - damage', Game.user.hp - data.damage);
                    Game.user.hp -= data.damage;
                }
                console.log('user after', Game.user);
            }
            for(let i = 0; i < Game.players.length; i++) {
                if(id === Game.players[i].id) {
                    console.log('player before', Game.players[i]);
                    if(Game.players[i].ac <= (data.roll + data.attackMod) || data.crit) {
                        GV.attacked = Game.players[i].actor.name;
                        console.log('hit', data.damage);
                        console.log('players[i].hp', Game.players[i].hp)
                        console.log('players[i].hp - damage', Game.players[i].hp - data.damage);
                        Game.players[i].settings = {hp: Game.players[i].hp};
                        $scope.$broadcast("attack", {source: Game.board[data.source.y][data.source.x], target: Game.players[i], damage: data.damage});
                        Game.players[i].hp -= data.damage;
                        GV.successfulHit = "HIT";
                        if(Game.players[i].hp <= 0) {
                            $scope.$broadcast("dead", {target: Game.players[i]});
                        }
                    } else {
                        GV.attackResult = "missed";
                        console.log('miss');
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
                        Game.monsters[i].monster.hp -= data.damage;
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
        if(Game.gameState === 'explore') {
            if ( Game.dmTurn ) {
                Game.exploreTurn = 0;
                Game.dmTurn = false;
            } else {
                Game.exploreTurn++;

                if ( Game.players.length <= Game.exploreTurn ) {
                  Game.dmTurn = true;
                }
            }
        } else if(Game.gameState === 'combat') {
            if(Game.combatTurn === Game.combatOrder.length - 1) {
                Game.combatTurn = 0;
            } else {
                Game.combatTurn++;
            }
        }
        checkTurn();
    });

    socket.on("return start combat", order => {
        Game.gameState = "combat";
        GV.gameState = "combat";
        GV.initActive = false;
        Game.dmTurn = false;
        Game.combatOrder = [];
        order.forEach( combatant => {
            Game.combatOrder.push(combatant.actor);
        } );

        console.log('combat order', Game.combatOrder);

        checkTurn();
    });

    socket.on("return end combat", () => {
        console.log('combat ended');
        Game.gameState = "explore";
        GV.attack = false;
        GV.gameState = "explore";
        Game.exploreTurn = 0;
        Game.dmTurn = false;
        checkTurn();
    });
    // END OF SOCKET ON LISTENERS + + + +



    // + + + + OTHER FUNCTIONS
    function updateActorPosition(source, target) {
        console.log("FROM UPDATE ACTOR", source, target);
        let x = source.x, y = source.y;
        let actorType = Game.board[y][x].type + 's';
        console.log('board square', Game.board[y][x]);
        console.log('square type', Game.board[y][x].type);
        console.log('actorType', actorType);
        for(let i = 0; i < Game[actorType].length; i++) {
            if(Game[actorType][i].id === Game.board[y][x].id) {
                Game[actorType][i].location.x = target.x;
                Game[actorType][i].location.y = target.y;
                console.log("FOUND AND UPDATED", Game[actorType][i]);
                break;
            }
        }
    }

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
        console.log('Game.moves', Game.moves);
        console.log('Game', Game);

    }

    function checkTurn() {
        GV.attack = false;
        if(Game.gameState === 'explore') {
            if ( Game.dmTurn ) {
                GV.turn = "the DM's";
                if ( Game.dmMode ) {
                  Game.isTurn = true;
                  GV.turn = "your";
                  console.log("IT'S THE DM'S TURN");
                }
            } else {
                if ( Game.players[ Game.exploreTurn ].id === Game.user.id ) {
                    console.log("IT'S YOUR TURN!");
                    Game.moves = Game.user.actor.speed;
                    GV.turn = "your"
                    Game.isTurn = true;
                    GV.actions = Game.actionOptions();
                } else {
                    GV.turn = `${Game.players[Game.exploreTurn].actor.name}'s`;
                }
            }
        } else if(Game.gameState === 'combat') {
            if( Game.combatOrder[Game.combatTurn] === Game.user.id ) {
                Game.moves = Game.user.actor.speed;
                Game.isTurn = true;
                GV.turn = "your";
                GV.actions = Game.actionOptions();
            } else {
                if(Game.combatOrder[Game.combatTurn].length < 6) {
                    for(let i = 0; i < Game.monsters.length; i++) {
                        if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                            GV.turn = `${Game.monsters[i].settings.name}'s`;
                            if(Game.dmMode) {
                                Game.moves = Game.monsters[i].settings.speed;
                                Game.isTurn = true;
                                GV.actions = Game.actionOptions(Game.monsters[i].location);
                            }
                        }
                    }
                } else {
                    for(let i = 0; i < Game.players.length; i++) {
                        if(Game.combatOrder[Game.combatTurn] === Game.players[i].id) {
                            GV.turn = `${Game.players[i].actor.name}'s`;
                        }
                    }
                }
            }
        }
        console.log("Check Turn Game.actions", Game.actions);
    }

    window.addEventListener ( "keydown", downHandler, false );
    window.addEventListener ( "keyup", upHandler, false );

    function downHandler() {
        if ( GV.keyUp  && Game.isTurn && (Game.moves > 0)) {
            GV.keyUp = false;
            //let character = (!Game.dmMode) ? Game.user : Game.getMonster();
            if(!Game.dmMode){
                switch( event.keyCode ) {
                    case 37:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x - 1, y: Game.user.location.y }, Game.user ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 38:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y - 1 }, Game.user ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 39:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x + 1, y: Game.user.location.y }, Game.user ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 40:
                        if ( Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y + 1 }, Game.user ) ) {
                            //Game.actionOptions();
                        }
                        break;
                }
            } else if(Game.dmTurn && Game.dmMode && Game.gameState !== 'initCombat') {
                console.log( "It's DM's turn!", Game.monsterExplore, Game.monsters );
                switch( event.keyCode ) {
                    case 37:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x - 1, y: Game.monsters[Game.monsterExplore].location.y }, Game.monsters[Game.monsterExplore] ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 38:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x, y: Game.monsters[Game.monsterExplore].location.y - 1 }, Game.monsters[Game.monsterExplore] ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 39:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x + 1, y: Game.monsters[Game.monsterExplore].location.y }, Game.monsters[Game.monsterExplore] ) ) {
                            //Game.actionOptions();
                        }
                        break;

                    case 40:
                        if ( Game.move( Game.monsters[Game.monsterExplore].location, { x: Game.monsters[Game.monsterExplore].location.x, y: Game.monsters[Game.monsterExplore].location.y + 1 }, Game.monsters[Game.monsterExplore] ) ) {
                            //Game.actionOptions();
                        }
                        break;
                }
            } else if(Game.gameState === 'combat') {
                switch( event.keyCode ) {
                    case 37:
                        if( Game.combatOrder[Game.combatTurn] === Game.user.id) {
                            Game.move( Game.user.location, { x: Game.user.location.x - 1, y: Game.user.location.y }, Game.user );
                            return;
                        }
                        if(Game.dmMode) {
                            for(let i = 0; i < Game.monsters.length; i++) {
                                if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                                    Game.move( Game.monsters[i].location, { x: Game.monsters[i].location.x - 1, y: Game.monsters[i].location.y }, Game.monsters[i] );
                                }
                            }
                        }
                        break;

                    case 38:
                        if ( Game.combatOrder[Game.combatTurn] === Game.user.id ) {
                            Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y - 1 }, Game.user );
                        }
                        if(Game.dmMode) {
                            for(let i = 0; i < Game.monsters.length; i++) {
                                if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                                    Game.move( Game.monsters[i].location, { x: Game.monsters[i].location.x, y: Game.monsters[i].location.y - 1 }, Game.monsters[i] );
                                }
                            }
                        }
                        break;

                    case 39:
                        if ( Game.combatOrder[Game.combatTurn] === Game.user.id ) {
                            Game.move( Game.user.location, { x: Game.user.location.x + 1, y: Game.user.location.y }, Game.user );
                        }
                        if(Game.dmMode) {
                            for(let i = 0; i < Game.monsters.length; i++) {
                                if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                                    Game.move( Game.monsters[i].location, { x: Game.monsters[i].location.x + 1, y: Game.monsters[i].location.y }, Game.monsters[i] );
                                }
                            }
                        }
                        break;

                    case 40:
                        if ( Game.combatOrder[Game.combatTurn] === Game.user.id ) {
                            Game.move( Game.user.location, { x: Game.user.location.x, y: Game.user.location.y + 1 }, Game.user )
                        }
                        if(Game.dmMode) {
                            for(let i = 0; i < Game.monsters.length; i++) {
                                if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                                    Game.move( Game.monsters[i].location, { x: Game.monsters[i].location.x, y: Game.monsters[i].location.y + 1 }, Game.monsters[i] );
                                }
                            }
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
            player.initiative = roll;
            order.push({actor: player.id, initiative: roll});
        } );
        Game.activeMonsters.forEach( monster => {
            let roll = rollMonsterInit(monster.initiative);
            order.push({actor: monster.id, initiative: roll});
        } );
        return order.sort( (a, b) => {
            return b.initiative - a.initiative;
        } );
    }

    function rollInit(dex) {
        const dexMod = Math.floor((dex - 10) / 2);
        return Math.ceil(Math.random() * 20) + dexMod;
    }

    function rollMonsterInit(initMod) {
        return Math.ceil(Math.random() * 20) + initMod;
    }

    $scope.$on('actor clicked', (event, actor) => {
        //If clicking on monster
        if(actor.id.length <= 5) {
            for(let i = 0; i < Game.monsters.length; i++) {
                if(actor.id === Game.monsters[i].id) {
                    if(Game.gameState === 'initCombat' && Game.dmMode) {
                        actor.initiative = Game.monsters[i].settings.initiative;
                        actor.name = Game.monsters[i].settings.name;
                        if( ( Game.monsters[i].settings.hp > 0 ) ) {
                            let flag = true;
                            for(let i = 0; i < Game.activeMonsters.length; i++) {
                                if(Game.activeMonsters[i].id === actor.id) {
                                    flag = false;
                                }
                            }
                            if(flag) {
                                Game.activeMonsters.push(actor);
                            }
                        }
                        GV.activeMonsters = Game.activeMonsters;
                        $scope.$apply();
                    } else if(Game.gameState === 'combat') {
                        if(Game.combatAction) {
                            for(let i = 0; i < Game.players.length; i++) {
                                if(Game.combatOrder[Game.combatTurn] === Game.players[i].id) {
                                    for(let j = 0; j < Game.monsters.length; j++) {
                                        if(actor.id === Game.monsters[j].id && Game.meleeTargets.indexOf(Game.monsters[j].id !== -1)) {
                                            Game[Game.combatAction](Game.players[i].location, Game.monsters[j].location);
                                            Game.combatAction = "";
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        Game.monsterExplore = i;
                        Game.moves = Game.monsters[Game.monsterExplore].settings.speed;
                    }
                }
            }
        } else {
            if(Game.combatAction) {
                for(let i = 0; i < Game.monsters.length; i++) {
                    if(Game.combatOrder[Game.combatTurn] === Game.monsters[i].id) {
                        for(let j = 0; j < Game.players.length; j++) {
                            if(actor.id === Game.players[j].id && Game.meleeTargets.indexOf(Game.players[j].id !== -1)) {
                                Game[Game.combatAction](Game.monsters[i].location, Game.players[j].location);
                                Game.combatAction = "";
                            }
                        }
                    }
                }
            }
        }
    })
    // OTHER FUNCTIONS + + + +

}
