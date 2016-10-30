const Spell = require("./Spell");

module.exports = {

    getSpells(req, res){
        Spell.find({}, (err, spells) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(spells);
        });
    }

    , postSpell(req, res){
        new Spell(req.body).save((err, spell) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(spell);
        });
    }

    , getSpellById(req, res){
        Spell.findById(req.params.id, (err, spell) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(spell);
        });
    }

};
