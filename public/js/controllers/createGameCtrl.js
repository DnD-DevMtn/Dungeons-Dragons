export default function($http, createGameService) {
  const create = this;
  create.hi = "hiiiiiii";
  create.postCampaign = (campaign) => {
    createGameService.postCampaign(campaign).then(campaign => {
      console.log(campaign);
    });
  }
}
