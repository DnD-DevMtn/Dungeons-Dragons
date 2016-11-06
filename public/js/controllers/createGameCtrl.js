export default function($http, $state, createGameService, userService) {
  const create = this;
  create.postCampaign = (campaign) => {
    userService.user.character = {name:"dm"};
    campaign.dm = {
      name: `${userService.user.first_name } ${userService.user.first_name}`,
      facebookId: userService.user.facebookId
    }
    campaign.status = "open";
    campaign.available = true;
    createGameService.postCampaign(campaign).then(response => {
      $state.go('lobby', {gameId:response.data._id, userChar: userService.user.character});
    });
  }
}
