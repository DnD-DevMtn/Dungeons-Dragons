import angular from "angular";
import uiRouter from "angular-ui-router";

// Styles
import "./sass/styles.scss";

// HTML

//Sockets
//import "socket.io";

// Controllers

import mainCtrl from "./js/controllers/mainCtrl";
import redirectCtrl from "./js/controllers/redirectCtrl";
import loginCtrl from "./js/controllers/loginCtrl";

// Services

import mainService from "./js/services/mainService";

// Factories
import sockets from "./js/services/sockets";

// Directives
import game from "./js/directives/game";

angular.module("DnD", [uiRouter])
  .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise("/");

      $stateProvider
      .state("home", {
          url: "/",
          templateUrl: "./views/login.html",
          controller: loginCtrl,
      })
      .state("redirect", {
          url: "/redirect",
          templateUrl: "./views/redirect.html",
          controller: redirectCtrl,
      })
      .state("game", {
          url: "/game",
          templateUrl: "./views/game/gameView.html",
      });
  })
  .controller("mainCtrl", mainCtrl)
  .directive("game", game)
  .service("mainService", mainService)
  .factory("sockets", sockets);
