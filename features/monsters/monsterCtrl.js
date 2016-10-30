const Monster = require("./Monster");

module.exports = {

    getMonsters(req, res){
        Monster.find({}, (err, monsters) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(monsters);
        });
    }

    , postMonster(req, res){
        new Monster(req.body).save((err, monster) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(monster);
        });
    }

    , getMonsterById(req, res){
        Monster.findById(req.params.id, (err, monster) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(monster);
        });
    }

};







// getMonsters(req, res){
//     Monster
//         .find()
//         .populate("Armor Weapon Other Spell")
//         .exec((err, monster) => {
//             //DO STUFF
//         })
// }
