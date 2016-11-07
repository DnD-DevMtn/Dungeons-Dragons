export default function($http) {

  this.postCampaign = (data) => {
    return $http.post('/api/campaigns', data).then(campaign => {
        return campaign;
    });
  }
}
