/*
This is the parent ctrl of everything game related. It should talk to the Pixi
engine, the game Engine, and the gameInfo Ctrls.
 */

export default function(engineService, userService, socket, $stateParams, $http, inventoryService) {
    const GV = this;


    GV.user = userService.user;

    GV.party = $stateParams.party;

    console.log(GV.user);

    if(GV.user.character.weapons) {
        getInventory(GV.user.character.weapons, GV.user.character.gear, GV.user.character.armor);
    }

    socket.on("return move", data => {
        let source = data.source, target = data.target;
        if(Game.board[source.x][source.y].id === Game.user.id){      // TODO in ctrl
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

        Game.board[target.x][target.y].type = type;           // set target square props to actor
        Game.board[target.x][target.y].id   = id;
        Game.board[target.x][target.y].free = false;

        // + + + PIXI MOVE + + + \\
        printBoard();
    });

    socket.on("return bash", data => {
        let x = data.target.x, y = data.target.y;

        if(success){
            Game.board[x][y].door.hp -= damage;
            if(Game.board[x][y].door.hp <= 0){
                Game.board[x][y].door.open = true;
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
        Game.board[x][y].door.open = false;

        // + + + PIXI OPEN DOOR + + + \\
    });

    socket.on("return closeDoor", data => {
        let x = data.target.x, y = data.target.y;
        Game.board[x][y].door.open = false;

        // + + + PIXI CLOSE DOOR + + + \\
    });

    socket.on("return perception", data => {

        // + + + PIXI DATA.ROLL + + + \\

        if(data.found.length === 0){
            // + + + PIXI NOTHING FOUND + + + \\
            return;
        }

        for(let i = 0; i < data.found.length; i++){
            let x = data.found[i][0], y = data.found[i][1];
            Game.board[x][y].item.found = true;
            break;
        }

        // + + + PIXI FOUND ANIMATION + + + \\
    });

    socket.on("return rogueTrapFind", data => {

        // + + + PIXI DATA.ROLL + + + \\

        if(data.found.length === 0){
            // + + + PIXI NOTHING FOUND + + + \\
            return;
        }

        for(let i = 0; i < data.found.length; i++){
            let x = data.found[i][0], y = data.found[i][1];
            Game.board[x][y].trap.found = true;
            break;
        }

        // + + + PIXI FOUND ANIMATION + + + \\
    });

    socket.on("return rogueDisarmTrap", data => {
        let x = data.target.x, y = data.target.y;
        let xx = data.source.x, yy = data.target.y;

        // + + + PIXI DATA.ROLL + + + \\

        // + + + PIXI DATA.SUCCESS success + + + \\

        if(!data.success){
            // + + + PIXI DATA.SUCCESS failed + + + \\
            // + + + PIXI DATA.DAMAGE + + + \\
            if(Game.board[xx][yy].id === Game.user.id){
                Game.user.hp -= data.damage;
            }
        }

        Game.board[x][y].trap.triggered = true;

    });

    socket.on("return rogueLockpick", data => {
        let x = data.target.x, y = data.target.y;

        // + + + PIXI DATA.ROLL + + + \\

        if(!success){
            // + + + PIXI DATA.SUCCESS failed + + + \\
            return;
        }

        // + + + PIXI DATA.SUCCESS success + + + \\
        Game.board[x][y].door.locked = false;

    });

    socket.on("return pickUpItem", data => {
        let x = data.source.x, y = data.source.y;

        // + + + PIXI DATA.ITEM.NAME + + + \\
        if(Game.board[x][y].id === Game.user.id){
            Game.user.items.push(data.item);
            Game.board[x][y].item = {};
            return;
        }
        for(let i = 0; i < Game.players.length; i++){
            if(Game.board[x][y].id === Game.players[i].id){
                Game.players[i].newItems.push(data.item);
                Game.board[x][y].item = {};
                break;
            }
        }

    });

    socket.on("return dropItem", data => {
        let x = data.source.x, y = data.source.y;

        // + + + PIXI DATA.ITEM.NAME + + + \\
        if(Game.board[x][y].id === Game.user.id){
            Game.board[x][y].item.items.push(data.item);
            // Game.user.items.splice(Game.user.items.indexOf(data.item), 1);   // TODO splice dropped item out of array of new Items;
            return;
        }
        for(let i = 0; i < Game.players.length; i++){
            if(Game.board[x][y].id === Game.players[i].id){
                Game.board[x][y].item.items.push(data.item);
                // Game.players[i].newItems.push(data.item);                    // TODO SAME AS ABOVE
                break;
            }
        }

    });

    socket.on("return melee", data => {
        let x = data.target.x, y = data.target.y;
        let xx = data.source.x, yy = data.source.y;

    });

    socket.on("return fighterPowerAttack", data => {

    });

    socket.on("return fighterCleave", data => {

    });

    socket.on("return castSpell", data => {

    });

    socket.on("return rogueSneakAttack", data => {

    });

    socket.on("rogueTrapFind", data => {

    });

    socket.on("return endTurn", data => {

    });


    function updateActorPosition(source, target){
        let x = source.x, y = source.y;
        let actorType = Game.board[x][y].type;
        for(let i = 0; i < Game[actorType].length; i++){
            if(Game[actorType][i].id === Game.board[x][y].id){
                Game[actorType][i].location.x = target.x;
                Game[actorType][i].location.y = target.y;
            }
        }
    }

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



    function getInventory(weapons, gear, armor) {
        console.log('this fired');
        inventoryService.getInventory(weapons, gear, armor)
        .then(results => {
            console.log(results);
            GV.user.character.weapons = results.weapons;
            GV.user.character.armor = results.armor;
            GV.user.character.gear = results.gear;
        });
    }

    function getInventory(weapons, gear, armor) {
        inventoryService.getInventory(weapons, gear, armor)
        .then(results => {
            GV.user.character.weapons = results.weapons;
            GV.user.character.armor = results.armor;
            GV.user.character.gear = results.gear;
        })
    }

}
