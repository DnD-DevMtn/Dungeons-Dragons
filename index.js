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
});
