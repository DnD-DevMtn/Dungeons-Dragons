import turnInfoCtrl from "../controllers/directives/turnInfoCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/turnInfo.html",
        controllerAs: "turn",
        controller: turnInfoCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
