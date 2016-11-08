export default function(socket, $stateParams, userService, $state) {

    const lobby = this;

    lobby.userChar  = $stateParams.userChar;
    lobby.campaign  = $stateParams.campaign;
    lobby.gameId    = $stateParams.gameId;
    lobby.user      = userService.user;
    lobby.party     = [];
    lobby.start     = false;

    lobby.filterDm = item => {
        return item.dm === false;
    }

    if(lobby.userChar.name === "dm") {
      lobby.dm = {
        name: "dm"
        , userName: `${userService.user.firstName} ${userService.user.lastName}`
        , status: "pending"
      }
    } else {
      lobby.dm = {};
    }

    let socketChar = {}

    lobby.userEnter = function(){
        socket.emit("join", {userId: lobby.user._id, userName: `${lobby.user.firstName} ${lobby.user.lastName}`, char: socketChar, room: lobby.gameId});
    }

    if($stateParams.userChar){
        if($stateParams.userChar === "dm"){
            socketChar.name = "dm";
            lobby.dm.player = lobby.user._id;
            lobby.dm.char   = ""
            lobby.userEnter();
            return;
        }
        socketChar = {
            name: lobby.userChar.name
            , race: lobby.userChar.race
            , classType: lobby.userChar.classType
            , sprite: lobby.userChar.sprite
            , level: lobby.userChar.level
            , alignment: lobby.userChar.alignment
            , hp: lobby.userChar.hp
            , size: lobby.userChar.size
            , speed: lobby.userChar.speed
        }
        lobby.userEnter();
    }

    lobby.signalReady = () => {
        socket.emit("send ready", {userId: lobby.user._id, room: lobby.gameId});
    }

    lobby.signalStart = () => {
        if(lobby.start && lobby.userChar.name === "dm") {
            socket.emit("send start", lobby.gameId);
        }
    }

    lobby.checkStart = () => {
        for(let i = 0; i < lobby.party.players.length; i++) {
            if(lobby.party.players[i].status === "pending") {
                lobby.start = false;
                return;
            }
        }
        lobby.start = true;
    }

    socket.on("joined", data => {
        if(data.newPlayer.dm) {
            lobby.dm.name = "dm";
            lobby.dm.userName = data.newPlayer.userName;
            lobby.party = data.party;
            return;
        }
        lobby.party = data.party;
        for(let i = 0; i < lobby.party.players.length; i++){
            if(lobby.party.players[i].dm) {
                lobby.dm.name = "dm";
                lobby.dm.userName = lobby.party.players[i].userName;
                lobby.dm.status = lobby.party.players[i].status;
            }
        }
    });

    socket.on("return ready", party => {
        for(let i = 0; i < party.players.length; i++){
            if(party.players[i].dm){
                lobby.dm.status = party.players[i].status;
            }
        }
        lobby.party = party;
        lobby.checkStart();
    });

    socket.on("return start", party => {
        lobby.party = party;
        $state.go("gameView", {gameId: lobby.party.room, userChar: lobby.uesrChar, party: lobby.party.players})
    });

}
