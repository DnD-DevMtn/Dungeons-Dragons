import pixiCtrl from "../controllers/directives/pixiCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/game.html",
        controllerAs: "pixi",
        controller: pixiCtrl,
    // let's worry about scope later
    // scope: {
    // }
    };
}
