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
        console.log('enter', lobby.userChar._id);
        socket.emit("join", {charId: lobby.userChar._id, userName: `${lobby.user.firstName} ${lobby.user.lastName}`, char: socketChar, room: lobby.gameId});
    }

    if($stateParams.userChar){
        if($stateParams.userChar === "dm"){
            socketChar.name = "dm";
            lobby.dm.player = lobby.userChar._id;
            lobby.dm.char   = "";
            lobby.userEnter();
            return;
        }
        socketChar = lobby.userChar;
        // {
        //     name: lobby.userChar.name
        //     , race: lobby.userChar.race
        //     , classType: lobby.userChar.classType
        //     , sprite: lobby.userChar.sprite
        //     , level: lobby.userChar.level
        //     , alignment: lobby.userChar.alignment
        //     , hp: lobby.userChar.hp
        //     , size: lobby.userChar.size
        //     , speed: lobby.userChar.speed
        //        , ba: lobby.userChar.baseAttack[0]

        //     , _id: lobby.userChar._id
        //     ,
        // }
        lobby.userEnter();
    }

    lobby.signalReady = () => {
        socket.emit("send ready", {charId: lobby.userChar._id, room: lobby.gameId});
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
        console.log('userChar', lobby.userChar);
        $state.go("gameView", {gameId: lobby.party.room, userChar: lobby.userChar, party: lobby.party.players, dungeon: dungeon})
    });


    ////////////

    const dungeon = {
    "_id" : "5823a84ffdc72b0a20c82f84",
    "name" : "sample00",
    "height" : 27,
    "width" : 27,
    "backgroundImage" : "BRICK",
    "startingLocation" : [{x: 15, y:25},{x:16, y:25},{x:17, y:25}],
    "traps" : [
        {
            "location" : {
                "x" : 7,
                "y" : 13
            }
        },
        {
            "location" : {
                "x" : 4,
                "y" : 13
            }
        },
        {
            "location" : {
                "x" : 3,
                "y" : 11
            }
        },
        {
            "location" : {
                "x" : 7,
                "y" : 11
            }
        }
    ],
    "doors" : [
        {
            "location" : {
                "x" : 22,
                "y" : 22
            }
        },
        {
            "location" : {
                "x" : 6,
                "y" : 9
            }
        },
        {
            "location" : {
                "x" : 9,
                "y" : 10
            }
        },
        {
            "location" : {
                "x" : 21,
                "y" : 13
            }
        },
        {
            "location" : {
                "x" : 16,
                "y" : 7
            }
        },
        {
            "location" : {
                "x" : 16,
                "y" : 4
            }
        }
    ],
    "items" : {
        "gear" : [
            {
                "location" : {
                    "x" : 9,
                    "y" : 18
                }
            },
            {
                "location" : {
                    "x" : 7,
                    "y" : 20
                }
            }
        ],
        "weapons" : [
            {
                "location" : {
                    "x" : 6,
                    "y" : 18
                }
            },
            {
                "location" : {
                    "x" : 13,
                    "y" : 17
                }
            },
            {
                "location" : {
                    "x" : 7,
                    "y" : 16
                }
            },
            {
                "location" : {
                    "x" : 3,
                    "y" : 8
                }
            }
        ],
        "armor" : [
            {
                "location" : {
                    "x" : 11,
                    "y" : 18
                }
            },
            {
                "location" : {
                    "x" : 4,
                    "y" : 16
                }
            }
        ]
    },
    "background" : [],
    "environment" : [
        {
            "image" : "WALL3",
            "location" : {
                "x" : 3,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 4,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 5,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 6,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 7,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 8,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 9,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 10,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 11,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 13,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 12,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 15,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 14,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 17,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 18,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 19,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 20,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 21,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 22,
                "y" : 3
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 23,
                "y" : 3
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 24,
                "y" : 3
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 2,
                "y" : 3
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 4
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 5
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 7
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 8
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 9
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 12
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 11
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 15
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 13
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 16
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 18
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 17
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 19
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 20
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 2,
                "y" : 21
            }
        },
        {
            "image" : "WALL5",
            "location" : {
                "x" : 2,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 3,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 4,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 5,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 6,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 7,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 9,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 8,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 10,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 12,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 11,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 14,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 13,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 16,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 18,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 17,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 19,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 20,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 21,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 23,
                "y" : 22
            }
        },
        {
            "image" : "WALL7",
            "location" : {
                "x" : 24,
                "y" : 22
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 21
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 20
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 19
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 18
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 17
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 16
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 15
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 14
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 11
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 12
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 10
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 9
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 8
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 7
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 6
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 5
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 24,
                "y" : 4
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 2,
                "y" : 6
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 3,
                "y" : 6
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 4,
                "y" : 6
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 5,
                "y" : 6
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 6,
                "y" : 6
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 6,
                "y" : 7
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 6,
                "y" : 8
            }
        },
        {
            "image" : "WALL6",
            "location" : {
                "x" : 6,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 5,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 4,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 3,
                "y" : 10
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 2,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 7,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 8,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 10,
                "y" : 10
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 11,
                "y" : 10
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 9
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 8
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 7
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 6
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 11,
                "y" : 5
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 12,
                "y" : 5
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 13,
                "y" : 5
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 14,
                "y" : 5
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 15,
                "y" : 5
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 16,
                "y" : 5
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 16,
                "y" : 3
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 16,
                "y" : 6
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 16,
                "y" : 8
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 16,
                "y" : 9
            }
        },
        {
            "image" : "WALL5",
            "location" : {
                "x" : 16,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 17,
                "y" : 10
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 18,
                "y" : 10
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 19,
                "y" : 10
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 19,
                "y" : 11
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 19,
                "y" : 12
            }
        },
        {
            "image" : "WALL6",
            "location" : {
                "x" : 19,
                "y" : 13
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 20,
                "y" : 13
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 22,
                "y" : 13
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 23,
                "y" : 13
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 24,
                "y" : 13
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 18,
                "y" : 13
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 10,
                "y" : 12
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 9,
                "y" : 12
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 7,
                "y" : 12
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 8,
                "y" : 12
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 6,
                "y" : 12
            }
        },
        {
            "image" : "WALL5",
            "location" : {
                "x" : 5,
                "y" : 12
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 11
            }
        },
        {
            "image" : "WALL1",
            "location" : {
                "x" : 11,
                "y" : 12
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 13
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 17,
                "y" : 13
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 11,
                "y" : 14
            }
        },
        {
            "image" : "WALL5",
            "location" : {
                "x" : 11,
                "y" : 15
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 12,
                "y" : 15
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 13,
                "y" : 15
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 14,
                "y" : 15
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 16,
                "y" : 15
            }
        },
        {
            "image" : "WALL7",
            "location" : {
                "x" : 17,
                "y" : 15
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 17,
                "y" : 14
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 15,
                "y" : 15
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 16
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 17
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 18
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 19
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 20
            }
        },
        {
            "image" : "WALL2",
            "location" : {
                "x" : 15,
                "y" : 21
            }
        },
        {
            "image" : "WALL6",
            "location" : {
                "x" : 15,
                "y" : 22
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 3,
                "y" : 14
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 4,
                "y" : 14
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 5,
                "y" : 14
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 6,
                "y" : 14
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 8,
                "y" : 14
            }
        },
        {
            "image" : "WALL3",
            "location" : {
                "x" : 7,
                "y" : 14
            }
        },
        {
            "image" : "WALL0",
            "location" : {
                "x" : 2,
                "y" : 14
            }
        },
        {
            "image" : "TREE0",
            "location" : {
                "x" : 19,
                "y" : 23
            }
        },
        {
            "image" : "TREE1",
            "location" : {
                "x" : 23,
                "y" : 23
            }
        },
        {
            "image" : "ROCK",
            "location" : {
                "x" : 19,
                "y" : 15
            }
        },
        {
            "image" : "TREE0",
            "location" : {
                "x" : 19,
                "y" : 18
            }
        }
    ],
    "monsters" : [
        {
            "image" : "DARKKNIGHT",
            "location" : {
                "x" : 22,
                "y" : 5
            }
        },
        {
            "image" : "SHIVA",
            "location" : {
                "x" : 19,
                "y" : 7
            }
        },
        {
            "image" : "JENOVA",
            "location" : {
                "x" : 9,
                "y" : 6
            }
        },
        {
            "image" : "DARKMAGE",
            "location" : {
                "x" : 9,
                "y" : 13
            }
        },
        {
            "image" : "BLANCA",
            "location" : {
                "x" : 9,
                "y" : 15
            }
        },
        {
            "image" : "GOLBEZ",
            "location" : {
                "x" : 21,
                "y" : 14
            }
        },
        {
            "image" : "GOLBEZ",
            "location" : {
                "x" : 18,
                "y" : 19
            }
        },
        {
            "image" : "GOLBEZ",
            "location" : {
                "x" : 8,
                "y" : 4
            }
        },
        {
            "image" : "DARKKNIGHT",
            "location" : {
                "x" : 5,
                "y" : 8
            }
        },
        {
            "image" : "IFRIT",
            "location" : {
                "x" : 13,
                "y" : 13
            }
        },
        {
            "image" : "DRAGON",
            "location" : {
                "x" : 13,
                "y" : 9
            }
        }
    ],
    "__v" : 0
}

}
