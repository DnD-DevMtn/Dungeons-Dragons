import combatCtrl from "../controllers/directives/combatCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/combat.html",
        controllerAs: "combat",
        controller: combatCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
