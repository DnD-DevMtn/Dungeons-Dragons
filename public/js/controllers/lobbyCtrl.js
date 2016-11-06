export default function(sockets, $stateParams, userService) {

    const lobby = this;

    lobby.userChar = $stateParams.userChar;
    lobby.gameId   = $stateParams.gameId;
    lobby.user     = userService.user;

    let socketChar = {}

    lobby.userEnter = function(){
        socket.emit("join", {userId: lobby.user._id, char: socketChar, room: lobby.gameId});
    }

    if($stateParams.userChar){
        if($stateParams.userChar === "dm"){
            socketChar.name = "dm";
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
