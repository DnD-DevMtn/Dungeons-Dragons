import exploreCtrl from "../controllers/directives/diceCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/explore.html",
        controllerAs: "exp",
        controller: exploreCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
