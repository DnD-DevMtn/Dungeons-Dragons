const Campaign = require("./Campaign");

module.exports = {

    getCampaigns(req, res){
        Campaign.find()
            .populate("Armor Weapon Gear")
            .exec((err, campaigns) => {
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
            .populate("Armor Weapon Gear")
            .exec((err, campaign) => {
                return (err) ? res.status(500).json(err) : res.status(200).json(campaign);
            });
    }

};
