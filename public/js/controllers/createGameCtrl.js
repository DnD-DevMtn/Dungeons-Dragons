export default function($http, $state, createGameService, userService) {
  const create = this;
  create.postCampaign = (campaign) => {
    userService.user.character = {name:"dm"};
    campaign.dm = {
      name: `${userService.user.first_name } ${userService.user.first_name}`,
      facebookId: userService.user.facebookId
    }
    createGameService.postCampaign(campaign).then(campaignData => {
      const campaign = campaignData.data;
      $state.go('lobby', {gameId:campaign._id, userChar: userService.user.character});
    });
  }
}
