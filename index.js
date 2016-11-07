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

        console.log(data);

        let isHost = (data.char.name === "dm") ? true : false;

        if(!(room in campaigns)){
            let players = [{
                    player: data.userId
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
            io.sockets.to(room).emit("joined", capaigns[room]);
            return;
        }
        const game = campaigns[room];
        if(game.status === "inProgress"){
            socket.emit("Cannot Join"); // TODO
        } else {
            socket.join(room);
            let newPlayer = {
                player: data.userId
                , char: data.char
                , status: "pending"
                , dm: isHost
            }
            game.players.push(newPlayer);
            io.sockets.to(room).emit("joined", campaigns[room]);
        }
    });

    socket.on("send ready", data => {
        const room = data.room;
        for(let i = 0; i < campaigns[room].players.length; i++){
            if(campaigns[room].players[i].player === data.userId){
                campaigns[room].players[i].status = "ready";
            }
        }
        io.sockets.to(room).emit("return ready", campaigns[room]);
    });

    socket.on("send start", room => {
        campaigns[room].status = "inProgress";
        io.sockets.to(room).emit("return start", campaigns[room]);
    })

    socket.on("bash", data => {
        socket.to(data.room).broadcast.emit(data);
    });

    socket.on("openDoor", data => {
        socket.to(data.room).broadcast.emit(data);
    });

    socket.on("closeDoor", data => {
        socket.to(data.room).broadcast.emit(data);
    });

    socket.on("perception", data => {
        socket.to(data.room).broadcast.emit(data);
    });

    socket.on("rogueTrapfind", data => {
        socket.to(data.room).broadcast.emit(data);
    });






});
