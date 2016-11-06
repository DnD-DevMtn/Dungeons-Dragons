export default function($http) {

  this.postCampaign = (campaign) => {
    return $http.post('/api/campaigns', campaign).then(campaign => {
        return campaign;
    });
  }
}
