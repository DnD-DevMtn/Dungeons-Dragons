export default function($http) {
  const userService = this;

  userService.user;

  userService.getUserByFacebook = facebookId => {
      return $http.get("/api/users/facebook/:id", facebookId)
        .then(reponse => {
            return response.data;
        });
  }

  userService.getUserCampaigns = gameId => {
      return $http.get("/api/campaigns/:id", gameId)
        .then(response => {
            return response.data;
        });
  }

}
