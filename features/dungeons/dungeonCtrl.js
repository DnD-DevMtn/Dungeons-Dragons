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
            .populate( "monsters.settings items.armor.item items.weapons.item items.gear.item" )
            .exec((err, dungeon) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(dungeon);
            });
    }

};
