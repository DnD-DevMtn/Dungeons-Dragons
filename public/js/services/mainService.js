function mainService($http) {
    this.getFBUser = () => {
        return $http.get("/api/facebook").then((response) => {
            return response.data;
        });
    };
}

module.exports = mainService;
