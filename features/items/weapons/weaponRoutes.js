const weaponCtrl = require("./weaponCtrl");

module.exports = app => {
  
    app.route("/api/weapons/:id")
          .get(weaponCtrl.getWeaponById);

    app.route("/api/weapons")
        .get(weaponCtrl.getWeapons)
        .post(weaponCtrl.postWeapon);

}
