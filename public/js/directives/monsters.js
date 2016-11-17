import monstersCtrl from "../controllers/directives/monstersCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/monsters.html",
        controllerAs: "monsters",
        controller: monstersCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
