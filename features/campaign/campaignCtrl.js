const Campaign = require("./Campaign");
const User = require("../users/User");

module.exports = {

    getCampaigns(req, res){
        Campaign.find()
            .exec((err, campaigns) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(campaigns);
            });
    }

    , getOpen(req, res){
        Campaign.find({status: "open"}, (err, campaigns) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(campaigns);
        });
    }

    , postCampaign(req, res){
        new Campaign(req.body.campaign).save((err, campaign) => {
            if(err) {
                return res.status(500).json(err);
            } else {
                User.findOneAndUpdate({facebookId: req.body.facebookId}, {$push: {campaigns: campaign._id}}, (err, user) => {
            })
                return res.status(201).json(campaign);
            }
        });
    }

    , getCampaignById(req, res){
        Campaign.findById(req.params.id)
            .exec((err, campaign) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
            });
    }

    , addPlayer(req, res){
        Campaign.findByIdAndUpdate(req.params.id
                                   , {$push: {players: {facebookId: req.body.facebookId, character: req.body.character}}}
                                   , (err, campaign) => {
            if(err){
                return res.status(500).json(err);
            } else {
                User.findOneAndUpdate({facebookId: req.body.facebookId}, {$push: {campaigns: req.params.id}}, (err, user) => {});
                return res.status(200).json(campaign);
            }
        });
    }

    , updateStatus(req, res){
        Campaign.findByIdAndUpdate(req.params.id, {status: req.body.status}, (err, campaign) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
        });
    }

    , addDungeon(req, res){
        Campaign.findByIdAndUpdate(req.params.id, {$push: {dungeons: req.body.dungeon}}, (err, campaign) => {
            return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
        });
    }

};
