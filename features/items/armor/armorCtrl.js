const Armor = require("./Armor");

module.exports = {

    getArmor(req, res){
        Armor.find({}, (err, armor) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(armor);
        });
    }

    , postArmor(req, res){
        new Armor(req.body).save((err, armor) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(armor);
        });
    }

    , getArmorById(req, res){
        Armor.findById(req.params.id, (err, armor) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(armor);
        });
    }

};
