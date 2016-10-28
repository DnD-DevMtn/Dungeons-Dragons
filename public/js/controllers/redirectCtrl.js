function redirectCtrl($scope, mainService){
  mainService.getFBUser().then(function(response){
    console.log(response);
    $scope.user = response;
  })
}

module.exports = redirectCtrl;
