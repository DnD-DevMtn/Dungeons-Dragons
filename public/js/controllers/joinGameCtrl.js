export default function(joinService, userService){

    const joinGame = this;

    joinGame.userService.user;            // gets the current user from the userService

    joinGame.getCampaigns = () => {
        joinService.getCampaigns().then(campaigns => {
            joinGame.campaigns = campaigns;


        });
    }

    joinGame.getCampaigns();


}
