export default function(userService){

    const dash = this;

    dash.currentUser = userService.user;
    dash.campaigns = [];

    dash.getCampaigns = () => {
        console.log('this fired');
        for(let i = 0; i < dash.currentUser.campaigns.length; i++){
            console.log(i);
            userService.getUserCampaigns(dash.currentUser.campaigns[i])
                .then(campaign => {
                    console.log(campaign);
                    dash.campaigns.push(campaign);
                });
        }
    }

    dash.getCampaigns();

}
