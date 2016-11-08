/*
This is the parent ctrl of everything game related. It should talk to the Pixi
engine, the game Engine, and the gameInfo Ctrls.
 */
export default function(engineService, userService, socket, $stateParams) {
    const GV = this;

    GV.user = userService.user;

    GV.party = $stateParams.party;








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
            Game.board[x][y].
        }
    });

    socket.on("return rogueDisarmTrap", data => {

    });

    socket.on("return rogueLockpick", data => {

    });

    socket.on("return pickUpItem", data => {

    });

    socket.on("return dropItem", data => {

    });

    socket.on("return melee", data => {

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


}
