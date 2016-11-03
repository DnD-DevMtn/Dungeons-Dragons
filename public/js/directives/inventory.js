import inventoryCtrl from "../controllers/directives/inventoryCtrl";

export default function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../../views/directives/inventory.html",
        controllerAs: "inv",
        controller: inventoryCtrl
    // let's worry about scope later
    // scope: {
    // }
    };
}
