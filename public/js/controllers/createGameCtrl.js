export default function($http, $state, createGameService, userService) {
  const create = this;
  create.postCampaign = (campaign) => {
    userService.user.character = {name:"dm"};
    campaign.dm = {
      name: `${userService.user.firstName } ${userService.user.lastName}`,
      facebookId: userService.user.facebookId
    }
    campaign.status = "open";
    const data = {
      campaign,
      facebookId: userService.user.facebookId
    }
    createGameService.postCampaign(data).then(response => {
      $state.go('lobby', {campaign:response.data, gameId:response.data._id, userChar: userService.user.character});
    });
  }
}
