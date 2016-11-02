import gameInfoCtrl from "../controllers/directives/gameInfoCtrl"

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/gameInfo.html",
        controllerAs: "UT",
        controller: gameInfoCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
