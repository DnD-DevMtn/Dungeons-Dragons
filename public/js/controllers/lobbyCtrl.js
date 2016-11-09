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


    ////////////

    const dungeon = {
    "_id" : "58227553face2d1598c1c865",
    "name" : "sample",
    "height" : 25,
    "width" : 24,
    "backgroundImage" : "BRICKTILE",
    "startingLocation" : [],
    "traps" : [],
    "doors" : [
        {
            "location" : {
                "x" : 4,
                "y" : 8
            }
        },
        {
            "location" : {
                "x" : 7,
                "y" : 9
            }
        },
        {
            "location" : {
                "x" : 13,
                "y" : 4
            }
        },
        {
            "location" : {
                "x" : 13,
                "y" : 7
            }
        },
        {
            "location" : {
                "x" : 19,
                "y" : 13
            }
        },
        {
            "location" : {
                "x" : 19,
                "y" : 20
            }
        }
    ],
    "items" : {
        "gear" : [],
        "weapons" : [],
        "armor" : []
    },
    "background" : [],
    "environment" : [
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 2,
                "y" : 5
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 3,
                "y" : 5
            }
        },
        {
            "image" : "FENCE02",
            "location" : {
                "x" : 4,
                "y" : 5
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 4,
                "y" : 6
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 4,
                "y" : 7
            }
        },
        {
            "image" : "FENCE22",
            "location" : {
                "x" : 4,
                "y" : 9
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 2,
                "y" : 9
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 3,
                "y" : 9
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 5,
                "y" : 9
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 6,
                "y" : 9
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 8,
                "y" : 9
            }
        },
        {
            "image" : "FENCE02",
            "location" : {
                "x" : 9,
                "y" : 9
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 9,
                "y" : 8
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 9,
                "y" : 7
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 9,
                "y" : 6
            }
        },
        {
            "image" : "FENCE00",
            "location" : {
                "x" : 9,
                "y" : 5
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 10,
                "y" : 5
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 11,
                "y" : 5
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 12,
                "y" : 5
            }
        },
        {
            "image" : "FENCE02",
            "location" : {
                "x" : 13,
                "y" : 5
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 13,
                "y" : 6
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 13,
                "y" : 3
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 13,
                "y" : 8
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 13,
                "y" : 9
            }
        },
        {
            "image" : "FENCE20",
            "location" : {
                "x" : 13,
                "y" : 10
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 14,
                "y" : 10
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 15,
                "y" : 10
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 16,
                "y" : 10
            }
        },
        {
            "image" : "FENCE02",
            "location" : {
                "x" : 17,
                "y" : 10
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 17,
                "y" : 11
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 17,
                "y" : 12
            }
        },
        {
            "image" : "FENCE20",
            "location" : {
                "x" : 17,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 18,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 20,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 21,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 16,
                "y" : 13
            }
        },
        {
            "image" : "FENCE00",
            "location" : {
                "x" : 15,
                "y" : 13
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 14
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 17
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 16
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 15
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 18
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 15,
                "y" : 19
            }
        },
        {
            "image" : "FENCE20",
            "location" : {
                "x" : 15,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 16,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 17,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 18,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 20,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 21,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 14,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 13,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 12,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 11,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 10,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 9,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 8,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 6,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 5,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 7,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 4,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 3,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 2,
                "y" : 20
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 3,
                "y" : 11
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 4,
                "y" : 11
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 5,
                "y" : 11
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 6,
                "y" : 11
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 7,
                "y" : 11
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 8,
                "y" : 11
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 9,
                "y" : 10
            }
        },
        {
            "image" : "FENCE02",
            "location" : {
                "x" : 9,
                "y" : 11
            }
        },
        {
            "image" : "FENCE10",
            "location" : {
                "x" : 9,
                "y" : 12
            }
        },
        {
            "image" : "FENCE20",
            "location" : {
                "x" : 9,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 10,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 11,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 12,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 13,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 14,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 2,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 3,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 4,
                "y" : 13
            }
        },
        {
            "image" : "FENCE11",
            "location" : {
                "x" : 5,
                "y" : 13
            }
        }
    ],
    "monsters" : [],
    "__v" : 0
}

}
