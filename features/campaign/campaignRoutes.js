const campaignCtrl = require("./campaignCtrl");

module.exports = app => {

    app.get("/api/campaigns/open", campaignCtrl.getOpen);
    app.put("/api/campaigns/join/:id", campaignCtrl.addPlayer);
    app.put("/api/campaigns/update/:id", campaignCtrl.updateStatus);
    app.put("/api/campaigns/dungeon/:id", campaignCtrl.addDungeon);

    app.route("/api/campaigns/:id")
        .get(campaignCtrl.getCampaignById);

    app.route("/api/campaigns")
        .get(campaignCtrl.getCampaigns)
        .post(campaignCtrl.postCampaign);



}
