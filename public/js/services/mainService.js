function mainService($http, $q){
  this.getFBUser = function(){
    return $http.get("/api/facebook").then(function(response){
      return response.data;
    })
  }
}

module.exports = mainService;
