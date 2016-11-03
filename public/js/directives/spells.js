import spellsCtrl from "../controllers/directives/partyCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/party.html",
        controllerAs: "spells",
        controller: spellsCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
