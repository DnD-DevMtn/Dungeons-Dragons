export default function(socket, $stateParams, userService) {

    const lobby = this;

    console.log(socket);

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

    // user
    // userChar


}
