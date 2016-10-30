const armorCtrl = require("./armorCtrl");

module.exports = app => {

    app.route("/api/armor")
        .get(armorCtrl.getArmor)
        .post(armorCtrl.postArmor);

    app.route("/api/armor/:id")
        .get(armorCtrl.getArmorById);

}
