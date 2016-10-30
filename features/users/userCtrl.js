const User = require("./User");

module.exports = {

    getUsers(req, res){
        User.find()
            .populate("Armor Weapon Gear Spell")
            .exec((err, users) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(users);
            });
    }

    , postUser(req, res){
        new User(req.body).save((err, user) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(user);
        });
    }

    , getUserById(req, res){
        User.findById(req.params.id)
            .populate("Armor Weapon Gear Spell")
            .exec((err, user) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(user);
            });
    }

};
