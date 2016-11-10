const express = require("express");
const json = require("body-parser").json;
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("./config.js");
const mongoose = require("mongoose");
const $ = require('jquery');
const jquery = require('jquery');

const mongoUri = config.mongoUri.uri;
const app = express();
const port = 8888;

//Sockets
const server = require("http").createServer(app);
const io     = require("socket.io").listen(server);

app.use(express.static(`${__dirname}/public`));
app.use(json({ limit: "50mb" }));
// app.use(cors());
mongoose.connect(mongoUri);
mongoose.connection.once("open", () => { console.log("connected to dnd db"); });
app.use(session({ secret: config.mySecrets.secret }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.cbUrl,
    profileFields: ["id", "first_name", "last_name"],
}, (token, refreshToken, profile, done) => {
    return done(null, profile);
}
));
require("./masterRoutes.js")(app);


server.listen(port, () => { console.log(`Listening on port ${port}`); });


const connections = [];
const campaigns = {};

io.on("connection", socket => {
    connections.push(socket);
    console.log(`New connection ${connections.length} socket(s) now connected on ${port}`);

    socket.on("disconnect", data => {
        connections.splice(connections.indexOf(data), 1);
        console.log(`Disconnected, ${connections.length} socket(s) now connected on ${port}`)
    });

    socket.on("join", data => {
        const room = data.room;

        let isHost = (data.char.name === "dm") ? true : false;

        if(!(room in campaigns)){
            let players = [{
                    player: data.charId
                    , userName: data.userName
                    , char: data.char
                    , status: "pending"
                    , dm: isHost
            }];
            campaigns[room] = {
                room: room
                , status: "waiting"
                , players: players
            };
            socket.join(room);
            console.log(campaigns[room]);
            io.sockets.to(room).emit("joined", {party: campaigns[room], newPlayer: players[0]});
            return;
        }
        const game = campaigns[room];
        if(game.status === "inProgress"){
            socket.emit("Cannot Join"); // TODO
        } else {
            socket.join(room);
            let newPlayer = {
                player: data.charId
                , userName: data.userName
                , char: data.char
                , status: "pending"
                , dm: isHost
            }
            game.players.push(newPlayer);
            io.sockets.to(room).emit("joined", {party: campaigns[room], newPlayer: newPlayer});
        }
    });

    socket.on("send ready", data => {
        const room = data.room;
        for(let i = 0; i < campaigns[room].players.length; i++){
            if(campaigns[room].players[i].player === data.charId){
                campaigns[room].players[i].status = "ready";
            }
        }
        console.log("FROM READY", campaigns[room]);
        io.sockets.to(room).emit("return ready", campaigns[room]);
    });

    socket.on("send start", room => {
        campaigns[room].status = "inProgress";
        console.log("FROM READY", campaigns[room]);
        io.sockets.to(room).emit("return start", campaigns[room]);
    });

    socket.on("move", data => {
        io.sockets.to(data.room).emit("return move", data);
    });

    socket.on("bash", data => {
        io.sockets.to(data.room).emit("return bash", data);
    });

    socket.on("openDoor", data => {
        io.sockets.to(data.room).emit("return openDoor", data);
    });

    socket.on("closeDoor", data => {
        io.sockets.to(data.room).emit("return closeDoor", data);
    });

    socket.on("perception", data => {
        io.sockets.to(data.room).emit("return perception", data);
    });

    socket.on("rogueTrapfind", data => {
        io.sockets.to(data.room).emit("return rogueTrapFind", data);
    });

    socket.on("rogueDisarmTrap", data => {
        io.sockets.to(data.room).emit("return rogueDisarmTrap", data);
    });

    socket.on("rogueLockpick", data => {
        io.sockets.to(data.room).emit("return rogueLockpick", data);
    });

    socket.on("pickUpItem", data => {
        io.sockets.to(data.room).emit("return pickUpItem", data);
    });

    socket.on("dropItem", data => {
        io.sockets.to(data.room).emit("return dropItem", data);
    });

    socket.on("melee", data => {
        io.sockets.to(data.room).emit("return melee", data);
    });

    socket.on("ranged", data => {
        io.sockets.to(data.room).emit("return ranged", data);
    });

    socket.on("fighterPowerAttack", data => {
        io.sockets.to(data.room).emit("return fighterPowerAttack", data);
    });

    socket.on("fighterCleave", data => {
        io.sockets.to(data.room).emit("return fighterCleave", data);
    });

    socket.on("castSpell", data => {
        io.sockets.to(data.room).emit("return castSpell", data);
    });

    socket.on("rogueSneakAttack", data => {
        io.sockets.to(data.room).emit("return rogueSneakAttack", data);
    });

    socket.on("endTurn", data => {
        io.sockets.to(data.room).emit("return endTurn", data);
    });


});
