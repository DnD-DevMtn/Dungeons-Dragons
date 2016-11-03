import charInfoCtrl from "../controllers/directives/characterInfoCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/characterInfo.html",
        controllerAs: "charInfo",
        controller: charInfoCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
