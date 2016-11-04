import diceCtrl from "../controllers/directives/diceCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/dice.html",
        controllerAs: "dice",
        controller: diceCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
