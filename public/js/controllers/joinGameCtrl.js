export default function(joinService, userService, $state){

    const joinGame = this;

    joinGame.currentUser = userService.user;            // gets the current user from the userService

    joinGame.campaigns = [];
    joinGame.getCampaigns = () => {
        joinService.getCampaigns().then(campaigns => {
            for(let i = 0; i < campaigns; i++){
                for(let j = 0; j < campaigns[i].players.length; j++){
                    if(campaigns[i].players[j].facebookId === currentUser.facebookId){
                        campaigns.splice(i, 1);
                    }
                }
            }
            joinGame.campaigns = campaigns;
        });
    }

    joinGame.getCampaigns();

    joinGame.charBuilder = gameId => {
        $state.go("characterBuilder", {room: gameId})
    }


}
