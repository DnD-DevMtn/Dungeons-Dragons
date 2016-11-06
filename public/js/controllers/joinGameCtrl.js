export default function(joinService){

    const joinGame = this;

    joinGame.getCampaigns = () => {
        joinService.getCampaigns().then(campaigns => {
            joinGame.campaigns = campaigns;
        });
    }

    joinGame.getCampaigns();


}
