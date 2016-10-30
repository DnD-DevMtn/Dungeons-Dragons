const monsterCtrl = require("./monsterCtrl");

module.exports = app => {

    app.route("/api/monsters")
        .get(monsterCtrl.getMonsters)
        .post(monsterCtrl.postMonster);

    app.route("/api/monsters/:id")
        .get(monsterCtrl.getMonsterById);

}
