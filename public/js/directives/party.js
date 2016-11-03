import partyCtrl from "../controllers/directives/partyCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/party.html",
        controllerAs: "party",
        controller: partyCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
