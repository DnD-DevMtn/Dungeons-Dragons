const Race = require("./Race");

module.exports = {

    getRaces(req, res){
        Race.find({}, (err, races) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(races);
        });
    }

    , postRace(req, res){
        new Race(req.body).save((err, race) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(race);
        });
    }

    , getRaceById(req, res){
        Race.findById(req.params.id, (err, race) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(race);
        });
    }

};
