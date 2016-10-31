const CharClass = require("./CharClass");

module.exports = {

    getClasses(req, res){
        CharClass.find({}, (err, classes) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(classes);
        });
    }

    , postClass(req, res){
        new CharClass(req.body).save((err, charClass) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(charClass);
        });
    }

    , getClassById(req, res){
        CharClass.findById(req.params.id, (err, charClass) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(charClass);
        });
    }

};
