export default function($http) {

  this.postCampaign = (campaign) => {
    console.log(campaign);
    return $http.post('/api/campaigns', campaign).then(campaign => {
        return campaign;
    });
  }
}
