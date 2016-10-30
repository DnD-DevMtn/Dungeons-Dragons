const Gear = require("./Gear");

module.exports = {

    getGear(req, res){
        Gear.find({}, (err, gear) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(gear);
        });
    }

    , postGear(req, res){
        new Gear(req.body).save((err, gear) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(gear);
        });
    }

    , getGearById(req, res){
        Gear.findById(req.params.id, (err, gear) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(gear);
        });
    }

};
