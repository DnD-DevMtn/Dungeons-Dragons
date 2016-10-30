function redirectCtrl($scope, mainService) {
    mainService.getFBUser().then((response) => {
        $scope.user = response;
    });
}

module.exports = redirectCtrl;
