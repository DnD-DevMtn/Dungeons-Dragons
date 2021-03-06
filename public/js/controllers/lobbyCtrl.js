export default function(socket, $stateParams, userService, $state, inventoryService) {

    const lobby = this;

    lobby.userChar  = $stateParams.userChar;
    lobby.campaign  = $stateParams.campaign;
    lobby.gameId    = $stateParams.gameId;
    lobby.user      = userService.user;
    lobby.party     = [];
    lobby.start     = false;

    const monsterIds = [];

    lobby.filterDm = item => {
        return item.dm === false;
    }

    if(lobby.userChar.weapons) {
        getInventory(lobby.userChar.weapons, lobby.userChar.gear, lobby.userChar.armor);
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
        socket.emit("join", {charId: lobby.userChar._id, userName: `${lobby.user.firstName} ${lobby.user.lastName}`, char: socketChar, room: lobby.gameId});
    }

    if(lobby.userChar.name === 'dm') {
        socketChar = lobby.userChar;
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
        console.log(lobby.campaign);
        console.log(lobby.campaign.dungeons[0]);
        userService.getDungeonById( lobby.campaign.dungeons[0] ).then( response => {
          const dungeon = response.data;
          if(lobby.userChar.name === "dm") {
            dungeon.monsters.forEach(monster => {
              monster.id = generateId();
            });
            socket.emit("monsterid", {room: lobby.party.room, dungeon: dungeon});
          }
        });
    });

    socket.on("return monsterid", data => {
      $state.go("gameView", {gameId: lobby.party.room, userChar: lobby.userChar, party: lobby.party.players, dungeon: data.dungeon});
    });

    function getInventory(weapons, gear, armor) {
        inventoryService.getInventory(weapons, gear, armor)
        .then(results => {
            lobby.userChar.weapons = results.weapons;
            lobby.userChar.armor = results.armor;
            lobby.userChar.gear = results.gear;

            socketChar = lobby.userChar;
            lobby.userEnter();
        })
    }

    function generateId(){
        while(true){
            let rand = Math.floor(Math.random() * 10000);
            if(monsterIds.indexOf(rand) === -1){
                monsterIds.push(rand);
                return rand.toString();
            }
        }
    }


//     ////////////
//
//     const dungeon = {
//     "_id" : "5823bb404841130c2bade956",
//     "name" : "gamma",
//     "height" : 26,
//     "width" : 27,
//     "backgroundImage" : "BRICK",
//     "startingLocation" : [
//         {"x": 15, "y": 23},
//         {"x": 16, "y": 23},
//         {"x": 17, "y": 23},
//         {"x": 18, "y": 23}
//     ],
//     "traps" : [
//         {
//             "location" : {
//                 "x" : 7,
//                 "y" : 13
//             },
//             "settings" : {
//                 "findDC" : 5,
//                 "disarmDC" : 5,
//                 "found" : false,
//                 "triggered" : false,
//                 "damage" : {
//                     "diceType" : 8,
//                     "diceNum" : 5,
//                     "mod" : 3
//                 }
//             }
//         },
//         {
//             "location" : {
//                 "x" : 3,
//                 "y" : 13
//             },
//             "settings" : {
//                 "findDC" : 5,
//                 "disarmDC" : 5,
//                 "found" : false,
//                 "triggered" : false,
//                 "damage" : {
//                     "diceType" : 8,
//                     "diceNum" : 5,
//                     "mod" : 3
//                 }
//             }
//         },
//         {
//             "location" : {
//                 "x" : 3,
//                 "y" : 11
//             },
//             "settings" : {
//                 "findDC" : 5,
//                 "disarmDC" : 5,
//                 "found" : false,
//                 "triggered" : false,
//                 "damage" : {
//                     "diceType" : 8,
//                     "diceNum" : 5,
//                     "mod" : 3
//                 }
//             }
//         },
//         {
//             "location" : {
//                 "x" : 8,
//                 "y" : 11
//             },
//             "settings" : {
//                 "findDC" : 5,
//                 "disarmDC" : 5,
//                 "found" : false,
//                 "triggered" : false,
//                 "damage" : {
//                     "diceType" : 8,
//                     "diceNum" : 5,
//                     "mod" : 3
//                 }
//             }
//         },
//         {
//             "location" : {
//                 "x" : 6,
//                 "y" : 11
//             },
//             "settings" : {
//                 "findDC" : 5,
//                 "disarmDC" : 5,
//                 "found" : false,
//                 "triggered" : false,
//                 "damage" : {
//                     "diceType" : 8,
//                     "diceNum" : 5,
//                     "mod" : 3
//                 }
//             }
//         }
//     ],
//     "doors" : [
//         {
//             "image" : "DOORSIDE",
//             "location" : {
//                 "x" : 14,
//                 "y" : 5
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         },
//         {
//             "image" : "DOOR1",
//             "location" : {
//                 "x" : 8,
//                 "y" : 10
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         },
//         {
//             "image" : "DOORSIDE",
//             "location" : {
//                 "x" : 6,
//                 "y" : 9
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         },
//         {
//             "image" : "DOORSIDE",
//             "location" : {
//                 "x" : 14,
//                 "y" : 9
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         },
//         {
//             "image" : "DOOR1",
//             "location" : {
//                 "x" : 21,
//                 "y" : 14
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         },
//         {
//             "image" : "DOOR1",
//             "location" : {
//                 "x" : 22,
//                 "y" : 21
//             },
//             "settings" : {
//                 "bashDC" : 3,
//                 "hp" : 3,
//                 "locked" : false,
//                 "pickDC" : 3,
//                 "open" : false
//             }
//         }
//     ],
//     "items" : {
//         "gear" : [
//             {
//                 "location" : {
//                     "x" : 5,
//                     "y" : 15
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 6
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 11,
//                     "y" : 19
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 6
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 16,
//                     "y" : 19
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 6
//                 }
//             }
//         ],
//         "weapons" : [
//             {
//                 "location" : {
//                     "x" : 11,
//                     "y" : 17
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 4
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 4,
//                     "y" : 17
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 4
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 14,
//                     "y" : 17
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 4
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 7,
//                     "y" : 19
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 4
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 10,
//                     "y" : 15
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 4
//                 }
//             }
//         ],
//         "armor" : [
//             {
//                 "location" : {
//                     "x" : 7,
//                     "y" : 16
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 2
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 9,
//                     "y" : 18
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 2
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 15,
//                     "y" : 15
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 2
//                 }
//             },
//             {
//                 "location" : {
//                     "x" : 13,
//                     "y" : 19
//                 },
//                 "settings" : {
//                     "found" : true,
//                     "findDC" : 2
//                 }
//             }
//         ]
//     },
//     "background" : [],
//     "environment" : [
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 3,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 6,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 7,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 8,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 9,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 11,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 10,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 13,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 15,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 12,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 16,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 17,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 18,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 19,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 20,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 21,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 22,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 23,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL0",
//             "location" : {
//                 "x" : 2,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 24,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 4
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 5
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 9
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 13
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 15
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 16
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 17
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 18
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 19
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 2,
//                 "y" : 20
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 4
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 5
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 9
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 13
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 15
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 16
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 17
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 18
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 19
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 24,
//                 "y" : 20
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 14,
//                 "y" : 3
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 14,
//                 "y" : 4
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 14,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 14,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 13,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 12,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 11,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL0",
//             "location" : {
//                 "x" : 10,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 10,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 10,
//                 "y" : 9
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 10,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 9,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 7,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL6",
//             "location" : {
//                 "x" : 6,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 6,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 6,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 6,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 3,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL0",
//             "location" : {
//                 "x" : 2,
//                 "y" : 6
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 3,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL0",
//             "location" : {
//                 "x" : 2,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 14,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 14,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "WALL5",
//             "location" : {
//                 "x" : 14,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 15,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 16,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 17,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 18,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 19,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 19,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 19,
//                 "y" : 13
//             }
//         },
//         {
//             "image" : "WALL6",
//             "location" : {
//                 "x" : 19,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 20,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 23,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 22,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 24,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 18,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 16,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 15,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 14,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 13,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 12,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 11,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL5",
//             "location" : {
//                 "x" : 10,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 10,
//                 "y" : 13
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 10,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 10,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 9,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 8,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 7,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 6,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 3,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 6,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 7,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 8,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL0",
//             "location" : {
//                 "x" : 2,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL1",
//             "location" : {
//                 "x" : 17,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 15
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 16
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 18
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 17
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 19
//             }
//         },
//         {
//             "image" : "WALL2",
//             "location" : {
//                 "x" : 17,
//                 "y" : 20
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 12,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 13,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 14,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 15,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 16,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 10,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 11,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 9,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 8,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 7,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 6,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 5,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 4,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 3,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 18,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 19,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 20,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 21,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL3",
//             "location" : {
//                 "x" : 23,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL7",
//             "location" : {
//                 "x" : 24,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL6",
//             "location" : {
//                 "x" : 17,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "WALL5",
//             "location" : {
//                 "x" : 2,
//                 "y" : 21
//             }
//         },
//         {
//             "image" : "TREE0",
//             "location" : {
//                 "x" : 19,
//                 "y" : 22
//             }
//         },
//         {
//             "image" : "TREE1",
//             "location" : {
//                 "x" : 23,
//                 "y" : 22
//             }
//         }
//     ],
//     "monsters" : [
//         {
//             "image" : "BLANCA",
//             "location" : {
//                 "x" : 13,
//                 "y" : 16
//             }
//         },
//         {
//             "image" : "BLANCA",
//             "location" : {
//                 "x" : 16,
//                 "y" : 5
//             }
//         },
//         {
//             "image" : "GOLBEZ",
//             "location" : {
//                 "x" : 21,
//                 "y" : 12
//             }
//         },
//         {
//             "image" : "DARKMAGE",
//             "location" : {
//                 "x" : 9,
//                 "y" : 14
//             }
//         },
//         {
//             "image" : "JENOVA",
//             "location" : {
//                 "x" : 8,
//                 "y" : 16
//             }
//         },
//         {
//             "image" : "GOLBEZ",
//             "location" : {
//                 "x" : 6,
//                 "y" : 18
//             }
//         },
//         {
//             "image" : "DRAGON",
//             "location" : {
//                 "x" : 11,
//                 "y" : 10
//             }
//         },
//         {
//             "image" : "IFRIT",
//             "location" : {
//                 "x" : 11,
//                 "y" : 5
//             }
//         },
//         {
//             "image" : "DARKKNIGHT",
//             "location" : {
//                 "x" : 8,
//                 "y" : 7
//             }
//         },
//         {
//             "image" : "BLANCA",
//             "location" : {
//                 "x" : 7,
//                 "y" : 4
//             }
//         },
//         {
//             "image" : "BLANCA",
//             "location" : {
//                 "x" : 21,
//                 "y" : 5
//             }
//         },
//         {
//             "image" : "GOLBEZ",
//             "location" : {
//                 "x" : 4,
//                 "y" : 11
//             }
//         },
//         {
//             "image" : "SHIVA",
//             "location" : {
//                 "x" : 20,
//                 "y" : 8
//             }
//         },
//         {
//             "image" : "SHIVA",
//             "location" : {
//                 "x" : 10,
//                 "y" : 17
//             }
//         },
//         {
//             "image" : "SHIVA",
//             "location" : {
//                 "x" : 4,
//                 "y" : 19
//             }
//         },
//         {
//             "image" : "SHIVA",
//             "location" : {
//                 "x" : 22,
//                 "y" : 18
//             }
//         }
//     ],
//     "__v" : 0
// }
//
}
