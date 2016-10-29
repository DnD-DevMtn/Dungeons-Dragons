import angular from "angular";
import uiRouter from "angular-ui-router";

// HTML

// Controllers

import mainCtrl from "./js/controllers/mainCtrl.js";
import redirectCtrl from "./js/controllers/redirectCtrl.js";

// Services

import mainService from "./js/services/mainService.js";

// Directives
import game from "./js/directives/game.js";

angular.module("DnD", [uiRouter])
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/")

    $stateProvider
      .state("home", {
        url : "/",
        templateUrl : "./views/login.html"
      })
      .state("redirect", {
        url : "/redirect",
        templateUrl : "./views/redirect.html",
        controller : redirectCtrl
      })
      .state("game", {
        url: "/game",
        templateUrl: "./views/game/gameView.html"
      })
  })
  .controller("mainCtrl", mainCtrl)
  .directive("game", game)
  .service("mainService", mainService)
