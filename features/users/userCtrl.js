const User = require("./User");

module.exports = {

    getUsers(req, res){
        User.find()
            .populate("armor weapons gear spells")
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
            .populate("armor weapons gear spells")
            .exec((err, user) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(user);
            });
    }

    , loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/");
        }
    }

    , userExists(req, res, next) {
        if(req.user){
            User.findOne({facebookId: req.user.id}, (err, user) => {
                if(err){
                    return res.status(500).json(err);
                }
                if(user){
                    return res.status(201).json(user);
                } else {
                    new User({
                        firstName: req.user._json.first_name
                        , lastName: req.user._json.last_name
                        , facebookId: req.user.id
                        , characters: []
                        , dmCampaigns: []
                    }).save((err, user) => {
                        return (err) ? res.status(500).json(err) : res.status(201).json(user);
                    })
                }
            });
        } else {
            res.redirect("/");
        }
    }

    , addCharacterToUser(req, res){
      User.findByIdAndUpdate(req.params.id, {$push : {"characters" : req.body}}, (error, response) => {
        if(error) {
          console.log(error);
          res.status(500).json(error);
        } else {
          return res.status(201).json(response);
        }
      })
    }

};
