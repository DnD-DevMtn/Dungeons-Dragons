const gearCtrl = require("./gearCtrl");

module.exports = app => {

    app.route("/api/gear")
        .get(gearCtrl.getGear)
        .post(gearCtrl.postGear);

    app.route("/api/gear/:id")
        .get(gearCtrl.getGearById);

}
