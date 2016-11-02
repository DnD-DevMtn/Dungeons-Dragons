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
import characterBuildingCtrl from "./js/controllers/characterBuildingCtrl";

// Services

import mainService from "./js/services/mainService";
import characterService from "./js/services/characterService";

// Factories
import sockets from "./js/services/sockets";

// Directives
import game from "./js/directives/game";
import videoChat from "./js/directives/videoChat";
import gameInfo from "./js/directives/gameInfo";

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
      })
      .state("characterBuilder", {
          url: "/init/character-builder",
          templateUrl: "./views/init/characterBuilder.html",
          controller : characterBuildingCtrl
      })
      .state("init-prompt", {
          url:"/init-prompt",
          templateUrl: "./views/init/createJoinDash.html",
      })
      .state("join", {
          url: "/join",
          templateUrl: "./views/init/join.html"
      })
      .state("lobby", {
          url: "/lobby",
          templateUrl: "./views/init/lobby.html"
      })
  })
  .controller("mainCtrl", mainCtrl)
  .directive("game", game)
  .directive("gameChat", videoChat)
  .directive("gameInfo", gameInfo)
  .service("mainService", mainService)
  .service("characterService", characterService)
  .factory("sockets", sockets);
