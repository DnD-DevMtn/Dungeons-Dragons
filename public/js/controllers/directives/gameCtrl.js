import "pixi.js";

export default function ( gameService ) {
  var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

    const mapGridWidth = 40, mapGridHeight = 40;
    const tileGridWidth = 40, tileGridHeight = 40;
    const obstacles = [];

    const numberOfTrees = 25;

    // Overall View; Comment cameraFocus in play function
    // const renderer = autoDetectRenderer( tileGridWidth * mapGridWidth, tileGridHeight * mapGridHeight );

    // Focused View; Uncomment cameraFocus in play function
    const renderer = autoDetectRenderer( 800, 800 );

    const gameEml = document.getElementById( "pixi-game-engine" );
    gameEml.appendChild( renderer.view );

    const stage = new Container();

    const gameScene = new Container();
    const gameOverScene = new Container();

    var message = new PIXI.Text(
      "The End!",
      { fontSize: "64px", fontFamily: "Futura", fill: "white" }
    );
    message.position.set( 120, renderer.height / 2 - 32 );

    gameOverScene.visible = false;
    gameOverScene.addChild( message );

    stage.addChild( gameScene );
    stage.addChild( gameOverScene );

    var id, floor, ironman, dragon, effects;

    loader
    .add( "./assets/GameImages/_sample.json" )
    .load( setup );

    function setup() {
      id = resources[ "./assets/GameImages/_sample.json" ].textures;

      floor = new Container();
      gameService.createFloor( id, "GRS2ROC11", floor, mapGridWidth, mapGridHeight, tileGridWidth, tileGridHeight );
      var boundaryFileNames = {
        left: "CLIFFVEG23",
        top: "CLIFFVEG32",
        right: "CLIFFVEG20",
        bottom: "CLIFFVEG01"
      };
      floor.container = gameService.createBoundaries( id, boundaryFileNames, floor, mapGridWidth, mapGridHeight, tileGridWidth, tileGridHeight );
      gameService.setGridWidthHeight( floor, tileGridWidth, tileGridHeight );
      gameScene.addChild( floor );

      ironman = new Sprite( id[ "IRONMAN10.png" ] );
      ironman.direction = 1; // left: 0, top: 1, right: 2, bottom: 3
      ironman.numOfTextures = 4;
      gameService.initializeObject( ironman, Math.floor( floor.gridWidth / 2 ), ( floor.gridHeight - 5 ), tileGridWidth, tileGridHeight, obstacles );
      gameScene.addChild( ironman );

      gameService.addHealthBar( ironman );
      gameScene.addChild( ironman.healthBar );

      dragon = new Sprite( id[ "DRAGON10.png" ] );
      dragon.direction = 3; // left: 0, top: 1, right: 2, bottom: 3
      dragon.numOfTextures = 4;
      gameService.initializeObject( dragon, Math.floor( floor.gridWidth / 2 ), 8, tileGridWidth, tileGridHeight, obstacles );
      gameScene.addChild( dragon );

      effects = {};
      effects.cutC = new Sprite( id[ "CUTC10.png" ] );
      effects.cutC.direction = 1;
      effects.cutC.numOfTextures = 5;
      effects.cutC.visible = false;
      gameScene.addChild( effects.cutC );

      for ( let i = 0; i < numberOfTrees; i++ ) {
        var tree = new Sprite( id[ `TREE0${ Math.round( Math.random() * 2 ) }.png` ] );

        var x = Math.floor( Math.random() * ( mapGridWidth - 4 - ( tree.width / tileGridWidth - 1 ) ) ) + 2;
        var y = Math.floor( Math.random() * ( mapGridHeight - 5 - ( tree.height / tileGridHeight - 1 ) ) ) + 3;

        gameService.initializeObject( tree, x, y, tileGridWidth, tileGridHeight, obstacles );
        gameScene.addChild( tree );
      }

      gameService.keyboard( ironman, obstacles, floor, tileGridWidth, tileGridHeight );

      gameLoop();
    }

    function gameLoop() {
      play();

      renderer.render( stage );

      requestAnimationFrame( gameLoop );
    }

    var animcationCounter = 0;
    var animationFrequency = 20;

    var randomMoveCounter = 0;
    var randomMoveFrequency = 180;

    function play() {
      gameService.cameraFocus( renderer, gameScene, ironman );

      if ( ironman.healthBar.children[ 1 ].width === 0 ) {
        gameOverScene.visible = true;
      }

      randomMoveCounter++;

      if ( randomMoveCounter > randomMoveFrequency ) {
        randomMoveCounter = randomMoveCounter % randomMoveFrequency;

        if ( gameService.engage( dragon, ironman ) >= 0 ) {
          dragon.direction = gameService.engage( dragon, ironman );
          gameService.takeDmg( id, ironman, 10, effects.cutC, "CUTC" );
        } else {
          gameService.randomMove( dragon, obstacles, floor, tileGridWidth, tileGridHeight );
        }
      }

      animcationCounter++;
      if ( animcationCounter / animationFrequency * ironman.numOfTextures > 0 )
        animcationCounter = animcationCounter % ( animationFrequency * ironman.numOfTextures );

      gameService.animation( id, ironman, "IRONMAN", Math.floor( animcationCounter / animationFrequency ) );
      gameService.animation( id, dragon, "DRAGON",  Math.floor( animcationCounter / animationFrequency ) );

      gameService.moveHealthBar( ironman );
    }
}
