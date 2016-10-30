const spellCtrl = require("./spellCtrl");

module.exports = app => {

    app.route("/api/spells")
        .get(spellCtrl.getSpells)
        .post(spellCtrl.postSpell);

    app.route("/api/spells/:id")
        .get(spellCtrl.getSpellById);

}
