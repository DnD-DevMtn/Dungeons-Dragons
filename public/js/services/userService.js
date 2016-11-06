export default function($http) {
  const userService = this;

  userService.user;

  userService.getUserByFacebook = facebookId => {
      return $http.get("/api/users/facebook/:id", facebookId)
        .then(reponse => {
            return response.data;
        });
  }
}
