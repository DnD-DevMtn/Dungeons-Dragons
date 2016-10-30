const Monster = require("./Monster");

module.exports = {

    getMonsters(req, res){
        Monster.find()
            .populate("Armor Weapon Gear Spell")
            .exec((err, monsters) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(monsters);
            });
    }

    , postMonster(req, res){
        new Monster(req.body).save((err, monster) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(monster);
        });
    }

    , getMonsterById(req, res){
        Monster.findById(req.params.id)
            .populate("Armor Weapon Gear Spell")
            .exec((err, monster) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(monsters);
            });
    }

};
