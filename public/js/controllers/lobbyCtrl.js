export default function(socket, $stateParams, userService, $state) {

    const lobby = this;

    lobby.userChar = $stateParams.userChar;
    lobby.gameId   = $stateParams.gameId;
    lobby.user     = userService.user;
    lobby.party    = [];
    if(lobby.userChar.name === "dm") {
      lobby.dm = {
        name: "dm"
        , userName: `${userService.user.firstName} ${userService.user.lastName}`
      }
    } else {
      lobby.dm = {};
    }

    let socketChar = {}

    lobby.userEnter = function(){
        socket.emit("join", {userId: lobby.user._id, char: socketChar, room: lobby.gameId});
    }

    if($stateParams.userChar){
        if($stateParams.userChar === "dm"){
            socketChar.name = "dm";
            lobby.dm.player = lobby.user._id;
            lobby.dm.char   = ""
            lobby.userEnter();
        } else {
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
        }
        lobby.userEnter();
    }

    lobby.signalReady = () => {
        socket.emit("send ready", {userId: lobby.user._id, room: lobby.gameId});
    }

    lobby.signalStart = () => {
        socket.emit("send start", gameId);
    }

    socket.on("joined", party => {
        lobby.party = party;
    });

    socket.on("return ready", party => {
        lobby.party = party;
    });

    socket.on("return start", party => {
        lobby.party = party;
        $state.go("gameView", {gameId: lobby.party.room, userChar: lobby.uesrChar, party: lobby.party.players})
    });



}
