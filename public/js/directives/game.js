import gameCtrl from "../controllers/directives/gameCtrl.js";
export default function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../../views/directives/game.html',
    controllerAs: 'game',
    controller: gameCtrl
    //let's worry about scope later
    // scope: {
    // }
  }
}
