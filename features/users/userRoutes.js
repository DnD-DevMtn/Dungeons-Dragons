const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./User");
const userCtrl = require("./userCtrl");

module.exports = app => {

    app.get("/auth/facebook", passport.authenticate("facebook"));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: "/#/redirect",
        failureRedirect: "/",
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    app.get("/api/facebook", userCtrl.loggedIn, userCtrl.userExists, (req, res, next) => {
        res.send(req.user);
    });

    app.route("/api/users")
        .get(userCtrl.getUsers)
        .post(userCtrl.postUser);

    app.route("/api/users/:id")
        .get(userCtrl.getUserById)
        .put(userCtrl.addCharacterToUser);
}
