const express = require('express');
const json = require('body-parser').json;
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config.js');
const mongoose = require("mongoose");
const mongoUri = config.mongoUri.uri;

const app = express();
const port = 8888;

app.use(express.static(`${__dirname}/public`));
app.use(json({limit: '50mb'}));
// app.use(cors());
// require("./masterRoutes.js")(app);
mongoose.connect(mongoUri);
mongoose.connection.once("open", function(){console.log("connected to dnd db");});
app.use(session({secret : config.mySecrets.secret}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID : config.facebook.clientID,
  clientSecret : config.facebook.secret,
  callbackURL : config.facebook.cbUrl,
  profileFields : ["id", "name"]
}, function(token, refreshToken, profile, done){
  return done(null, profile);
}));

function loggedIn(req, res, next){
  if(req.user){
    next();
  } else {
    res.redirect("/");
  }
}


app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect : "/#",
  failureRedirect : "/"
}));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

app.get("/api/facebook", loggedIn, function(req, res, next){
  res.send(req.user);
})

app.listen(port, function(){console.log(`Listening on port ${port}`);})
