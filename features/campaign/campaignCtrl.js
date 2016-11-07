const Campaign = require("./Campaign");

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
        new Campaign(req.body).save((err, campaign) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(campaign);
        });
    }

    , getCampaignById(req, res){
        Campaign.findById(req.params.id)
            .exec((err, campaign) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
            });
    }

    , addPlayer(req, res){
        console.log("ADDING PLAYER", req.body);
        console.log("THIS IS THE ID", req.params.id);
        Campaign.findByIdAndUpdate(req.params.id
                                   , {$push: {players: {facebookId: req.body.facebookId, character: req.body.character}}}
                                   , (err, campaign) => {
                                       console.log(campaign);
            return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
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
