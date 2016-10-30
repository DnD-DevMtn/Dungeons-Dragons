const Campaign = require("./Campaign");

module.exports = {

    getCampaigns(req, res){
        Campaign.find({}, (err, campaigns) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(campaigns);
        });
    }

    , postCampaign(req, res){
        new Campaign(req.body).save((err, campaign) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(campaign);
        });
    }

    , getCampaignById(req, res){
        Campaign.findById(req.params.id, (err, campaign) => {
            return (err) ? res.status(500).json(err) : res.status(201).json(campaign);
        });
    }

};
