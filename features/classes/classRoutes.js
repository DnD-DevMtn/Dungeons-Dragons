const classCtrl = require("./classCtrl");

module.exports = app => {

    app.route("/api/classes")
        .get(classCtrl.getClasses)
        .post(classCtrl.postClass);

    app.route("/api/classes/:id")
        .get(classCtrl.getClassById);

}
