export default function($http, $state, createGameService, userService) {
  const create = this;
  create.postCampaign = (campaign) => {
    userService.user.character = {name:"dm"};
    console.log(userService.user);
    campaign.dm = {
      name: `${userService.user.firstName } ${userService.user.firstName}`,
      facebookId: userService.user.facebookId
    }
    campaign.status = "open";
    createGameService.postCampaign(campaign).then(response => {
      $state.go('lobby', {gameId:response.data._id, userChar: userService.user.character});
    });
  }
}
