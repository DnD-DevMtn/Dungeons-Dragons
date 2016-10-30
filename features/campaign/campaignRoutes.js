const campaignCtrl = require("./campaignCtrl");

module.exports = app => {

    app.route("/api/campaigns")
        .get(campaignCtrl.getCampaigns)
        .post(campaignCtrl.postCampaign);

    app.route("/api/campaigns/:id")
        .get(campaignCtrl.getCampaignById);

}
