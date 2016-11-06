export default function($http){

    this.getCampaigns = () => {
        return $http.get("/api/campaigns")
    }

}
