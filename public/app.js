import angular from "angular";
import uiRouter from "angular-ui-router";

// Styles

import "./sass/styles.scss";

// HTML

// Controllers

import mainCtrl from "./js/controllers/mainCtrl";
import redirectCtrl from "./js/controllers/redirectCtrl";
import loginCtrl from "./js/controllers/loginCtrl";
import characterBuildingCtrl from "./js/controllers/characterBuildingCtrl";
import gameViewCtrl from "./js/controllers/gameViewCtrl";
import createGameCtrl from "./js/controllers/createGameCtrl";
import lobbyCtrl from "./js/controllers/lobbyCtrl";

// Services
import mainService from "./js/services/mainService";
import gameService from "./js/services/gameService";
import characterService from "./js/services/characterService";
import engineService from "./js/services/engineService";
import dungeonService from "./js/services/dungeonService";
import userService from "./js/services/userService";
import createGameService from "./js/services/createGameService";

// Factories
import sockets from "./js/services/sockets";

// Directives
import game from "./js/directives/game";
import videoChat from "./js/directives/videoChat";
import gameInfo from "./js/directives/gameInfo";
import charInfo from "./js/directives/characterInfo";
import inventory from "./js/directives/inventory";
import party from "./js/directives/party";
import spells from "./js/directives/spells";
import dice from "./js/directives/dice";
import explore from "./js/directives/explore";
import combat from "./js/directives/combat";

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
      .state("gameView", {
          url: "/game",
          templateUrl: "./views/game/gameView.html",
          controllerAs: 'GV',
          controller: gameViewCtrl
      })
      .state("characterBuilder", {
          url: "/init/character-builder",
          templateUrl: "./views/init/characterBuilder.html",
          controller : characterBuildingCtrl
      })
      .state("init-prompt", {
          url:"/init-prompt",
          templateUrl: "./views/init/createJoinDash.html"
      })
      .state("create", {
          url: "/create",
          templateUrl: "./views/init/create.html",
          controllerAs: 'create',
          controller: createGameCtrl
      })
      .state("join", {
          url: "/join",
          templateUrl: "./views/init/join.html"
      })
      .state("lobby", {
          url: "/lobby",
          templateUrl: "./views/init/lobby.html",
          controller: lobbyCtrl,
          controllerAs: "lobby"
      })
  })
  .controller("mainCtrl", mainCtrl)
  .directive("game", game)
  .directive("gameChat", videoChat)
  .directive("gameInfo", gameInfo)
  .directive("charInfo", charInfo)
  .directive("inventory", inventory)
  .directive("party", party)
  .directive("spells", spells)
  .directive("dice", dice)
  .directive("explore", explore)
  .directive("combat", combat)
  .service("mainService", mainService)
  .service("gameService", gameService)
  .service("characterService", characterService)
  .service("engineService", engineService)
  .service("dungeonService", dungeonService)
  .service("createGameService", createGameService)
  .service("userService", userService)
  .factory("sockets", sockets);
