const Weapon = require("./Weapon");

module.exports = {

    getWeapons(req, res){
        Weapon.find({}, (err, weapons) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(weapons);
        });
    }

    , postWeapon(req, res){
        new Weapon(req.body).save((err, weapon) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(weapon);
        });
    }

    , getWeaponById(req, res){
        Weapon.findById(req.params.id, (err, weapon) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(weapon);
        });
    }

};
