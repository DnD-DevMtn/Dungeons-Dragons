const raceCtrl = require("./raceCtrl");

module.exports = app => {

    app.route("/api/races")
        .get(raceCtrl.getRaces)
        .post(raceCtrl.postRace);

    app.route("/api/races/:id")
        .get(raceCtrl.getRaceById);

}
