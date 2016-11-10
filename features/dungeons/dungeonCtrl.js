const Dungeon = require("./Dungeon");

module.exports = {

    getDungeons(req, res){
        Dungeon.find()
            .populate("Monster Armor Weapon Gear")
            .exec((err, dungeons) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(dungeons);
            });
    }

    , postDungeon(req, res){
        new Dungeon(req.body).save((err, dungeon) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(dungeon);
        });
    }

    , getDungeonById(req, res){
        Dungeon.findById(req.params.id)
            .populate(
                {
                    path: "monsters.monster"
                    , model: "Monster"
                }, {
                    path: "items.armor.item"
                    , model: "Armor"
                }, {
                    path: "items.weapons.item"
                    , model: "Weapon"
                }, {
                    path: "items.gear.item"
                    , model: "Gear"
                }
            )
            .exec((err, dungeon) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(dungeon);
            });
    }

};
