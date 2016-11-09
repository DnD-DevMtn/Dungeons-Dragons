import "pixi.js";

export default function( $scope ) {

    $scope.Dungeon = $scope.GV.pixiDungeon;
      // dummy data
    // $scope.Dungeon = {
    //   width: 20,
    //   height: 20,
    //   backgroundImage: "GRS2ROC03",
    //   players: [ {
    //     id: 101,
    //     image: "STARLORD",
    //     location: { x: 10, y: 10 }
    //   } ],
    //   monsters: [ {
    //     id: 103,
    //     image: "DRAGON",
    //     location: { x: 13, y: 13 }
    //   } ],
    //   doors: [ {
    //     id: 721,
    //     image: "DOOR",
    //     location: { x: 5, y: 5 },
    //     settings: {
    //       bashDC: 3,
    //       hp: 3,
    //       locked: true,
    //       pickDC: 4
    //     }
    //   } ],
    //   environment: [ {
    //     id: 115,
    //     image: "TREE00",
    //     location: { x: 5, y: 13 }
    //   } ],
    //   traps: [ {
    //     id: 990,
    //     image: "TRAP",
    //     location: { x: 9, y: 6 },
    //     settings: {
    //       damage: {
    //         diceNum: 3,
    //         diceType: 3,
    //         mod: 3
    //       },
    //       disarmDC: 3,
    //       findDC: 4,
    //       found: true,
    //       triggered: false
    //     }
    //   } ],
    //   items: {
    //     weapons: [ {
    //       id: 875,
    //       image: "WEAPON",
    //       location: { x: 11, y: 4 },
    //       settings: {
    //         findDC: 4,
    //         found: false
    //       }
    //     } ]
    //   }
    // };

    // Actual class declaration
    var p = new Game( $scope.Dungeon );
    var character = $scope.Dungeon.players[ 0 ];

    // Delete below up to stop point....
    window.addEventListener ( "keydown", downHandler, false );
    window.addEventListener ( "keyup", upHandler, false );

    function downHandler() {
      if ( $scope.keyUp ) {
        $scope.keyUp = false;
        switch( event.keyCode ) {
          case 37:
            if ( p.move( character, { x: character.location.x - 1, y: character.location.y } ) ) {
              character.location.x--;
            }
            break;

          case 38:
            if ( p.move( character, { x: character.location.x, y: character.location.y - 1 } ) ) {
              character.location.y--;
            }
            break;

          case 39:
            if ( p.move( character, { x: character.location.x + 1, y: character.location.y } ) ) {
              character.location.x++;
            }
            break;

          case 40:
            if ( p.move( character, { x: character.location.x, y: character.location.y + 1 } ) ) {
              character.location.y++;
            }
            break;
        }
      }
    }

    function upHandler() {
      $scope.keyUp = true;
    }
    // Stop point...
  };

class Game {
  constructor( Dungeon ) {
    console.log(Dungeon);
    this.gameUtil = new Game_Util();

    this.stage = new PIXI.Container();
    this.gameScene = new PIXI.Container();
    this.floor = new PIXI.Container();

    this.gameScene.addChild( this.floor );
    this.stage.addChild( this.gameScene );

    this.tileGridWidth = 40;
    this.tileGridHeight = 40;
    this.actors = {};
    this.obstacles = [];

    this.animationCounter = 0;

    this.floor.gridWidth = Dungeon.width;
    this.floor.gridHeight = Dungeon.height;
    this.floor.tileImage = Dungeon.backgroundImage;
    this.players = Dungeon.players;
    this.monsters = Dungeon.monsters;
    this.doors = Dungeon.doors;
    this.environment = Dungeon.environment;

    this.renderer = PIXI.autoDetectRenderer( this.floor.gridWidth * this.tileGridWidth, this.floor.gridHeight * this.tileGridWidth );
    document.getElementById( "pixi-in-game" ).appendChild( this.renderer.view );

    PIXI.loader.add( "./assets/GameImages/_sample.json" ).load( this.initView.bind( this ) );
  }

  initView() {
    this.id = PIXI.loader.resources[ "./assets/GameImages/_sample.json" ].textures;

    this.createFloor();
    this.placeActors( this.players );
    this.placeActors( this.monsters );
    this.placeProps( this.doors );
    this.placeProps( this.environment );
    this.play();
  }

  play() {
    this.animation();

    this.renderer.render( this.stage );

    requestAnimationFrame( this.play.bind( this ) );
  }

  createFloor() {
    var tile;

    // Compose floor tiles
    for ( let i = 0; i < this.floor.gridHeight; i++ ) {
      for ( let j = 0; j < this.floor.gridWidth; j++ ) {
        tile = new PIXI.Sprite( this.id[ `${ this.floor.tileImage }.png` ] );
        tile.position.set( j * this.tileGridWidth, i * this.tileGridHeight );

        this.floor.addChild( tile );
      }
    }

    // Create boundaries
    var boundaryLeft, boundaryRight, boundaryTop, boundaryBottom;

    for ( let i = 0; i < this.floor.gridHeight; i++ ) {
      boundaryLeft = new PIXI.Sprite( this.id[ `CLIFFVEG23.png` ] );
      boundaryRight = new PIXI.Sprite( this.id[ `CLIFFVEG20.png` ] );

      boundaryLeft.position.set( 0, i * this.tileGridHeight );
      boundaryRight.position.set(
        this.floor.gridWidth * this.tileGridWidth - boundaryRight.width,
        i * this.tileGridHeight
      );

      this.floor.addChild( boundaryLeft );
      this.floor.addChild( boundaryRight );
    }

    for ( let j = 0; j < this.floor.gridWidth; j++ ) {
      boundaryTop = new PIXI.Sprite( this.id[ `CLIFFVEG32.png` ] );
      boundaryBottom = new PIXI.Sprite( this.id[ `CLIFFVEG01.png` ] );

      boundaryTop.position.set( j * this.tileGridWidth, 0 );
      boundaryBottom.position.set(
        j * this.tileGridWidth,
        this.floor.gridHeight * this.tileGridHeight - boundaryBottom.height
      );

      this.floor.addChild( boundaryTop );
      this.floor.addChild( boundaryBottom );
    }

    // Save boundary information in floor
    this.floor.boundaries = {
      left: boundaryLeft.width / this.tileGridWidth,
      top: boundaryTop.height / this.tileGridHeight,
      right: boundaryRight.width / this.tileGridWidth,
      bottom: boundaryBottom.height / this.tileGridHeight
    }
  }

  placeActors( characters ) {
    var actor;

    for ( let i = 0; i < characters.length; i++ ) {
      actor = new PIXI.Sprite( this.id[ `${ characters[ i ].image }30.png` ] );
      actor.image = characters[ i ].image;
      actor.direction = 3; // left: 0, top: 1, right: 2, bottom: 3
      // actor.coordinate = { x: characters[ i ].location.x, y: characters[ i ].location.y };
      this.gameUtil.setGridWidthHeight( actor, this.tileGridWidth, this.tileGridHeight );
      actor.coordinate = this.gameUtil.gridCoordinate( actor, characters[ i ] );
      actor.gridOccupation = this.gameUtil.gridOccupation( actor );
      this.gameUtil.addObstacle( actor, this.obstacles );
      this.gameUtil.setPositionFromGrid( actor, this.tileGridWidth, this.tileGridHeight );

      this.actors[ characters[ i ].id ] = actor;
      this.gameScene.addChild( actor );
      this.gameUtil.orderProps( this.gameScene.children );
    }
  }

  placeProps( properties ) {
    var prop;

    for ( let i = 0; i < properties.length; i++ ) {
      prop = new PIXI.Sprite( this.id[ `${ properties[ i ].image }.png` ] );
      prop.image = properties[ i ].image;
      this.gameUtil.setGridWidthHeight( prop, this.tileGridWidth, this.tileGridHeight );
      prop.coordinate = this.gameUtil.gridCoordinate( prop, properties[ i ] );
      prop.gridOccupation = this.gameUtil.gridOccupation( prop );
      this.gameUtil.addObstacle( prop, this.obstacles );
      this.gameUtil.setPositionFromGrid( prop, this.tileGridWidth, this.tileGridHeight );

      this.gameScene.addChild( prop );
      this.gameUtil.orderProps( this.gameScene.children );
    }
  }

  animation() {
    this.animationCounter %= 100;

    for ( let i in this.actors ) {
      this.actors[ i ].texture = this.id[
        `${ this.actors[ i ].image }${ this.actors[ i ].direction }${ Math.floor( this.animationCounter / 25 ) }.png`
      ];
    }

    this.animationCounter++;
  }

  move( character, targetLocation ) {
    var result = false;
    var actor = this.actors[ character.id ];

    var targetOccupation = this.gameUtil.gridOccupation( {
      coordinate: targetLocation, gridWidth: actor.gridWidth, gridHeight: actor.gridHeight
    } );

    this.gameUtil.removeObstacle( actor, this.obstacles );
    actor.direction = this.gameUtil.getObjectDirection( actor.coordinate, targetLocation );

    if ( this.gameUtil.validateTargetLocation( targetOccupation, this.obstacles, this.floor ) ) {
      actor.coordinate = targetLocation;
      result = true;
    }

    actor.gridOccupation = this.gameUtil.gridOccupation( actor );
    this.gameUtil.addObstacle( actor, this.obstacles );
    this.gameUtil.setPositionFromGrid( actor, this.tileGridWidth, this.tileGridHeight );
    this.gameUtil.orderProps( this.gameScene.children );

    return result;
  }
};

class Game_Util {
  constructor() {}

  setGridWidthHeight( object, tileGridWidth, tileGridHeight ) {
    object.gridWidth = object.width / tileGridWidth;
    object.gridHeight = object.height / tileGridHeight;
  }

  gridCoordinate( object, property ) {
    return {
      x: property.location.x,
      y: property.location.y - object.gridHeight + 1
    }
  }

  gridOccupation( object ) {
    var result = [];

    for ( let i = 0; i < object.gridWidth; i++ ) {
      result.push( {
        x: object.coordinate.x + i,
        y: object.coordinate.y + object.gridHeight - 1
      } );
    }

    return result;
  }

  addObstacle( object, obstacles ) {
    for ( let i = 0; i < object.gridOccupation.length; i++ ) {
      obstacles.push( object.gridOccupation[ i ] );
    }
  }

  removeObstacle( object, obstacles ) {
    var gridOccupation = object.gridOccupation.slice();

    for ( let i = gridOccupation.length - 1; i >= 0; i-- ) {
      for ( let j = obstacles.length - 1; j >= 0; j-- ) {
        if ( obstacles[ j ].x === gridOccupation[ i ].x && obstacles[ j ].y === gridOccupation[ i ].y ) {
          obstacles.splice( j, 1 );
          gridOccupation.splice( i, 1 );
          break;
        }
      }
    }
  }

  setPositionFromGrid( object, tileGridWidth, tileGridHeight ) {
    object.position.set(
      object.coordinate.x * tileGridWidth,
      object.coordinate.y * tileGridHeight - object.gridHeight + 1
    );
  }

  orderProps( props ) {
    props.sort( ( prop1, prop2 ) => {
      if ( !prop1.gridOccupation )
        return -1;
      else if ( !prop2.gridOccupation )
        return 1;
      else
        return prop1.gridOccupation[ 0 ].y - prop2.gridOccupation[ 0 ].y ;
    } )
  }

  getObjectDirection( source, target ) {
    if ( target.x - source.x > 0 )
      return 2;

    else if ( target.x - source.x < 0 )
      return 0;

    else if ( target.y - source.y > 0 )
      return 3;

    else if ( target.y - source.y < 0 )
      return 1;
  }

  validateTargetLocation( targetOccupation, obstacles, floor ) {
    for ( let i = targetOccupation.length - 1; i >= 0; i-- ) {
      // Check if there's an obstacle in target location
      for ( let j = obstacles.length - 1; j >= 0; j-- ) {
        if ( obstacles[ j ].x === targetOccupation[ i ].x && obstacles[ j ].y === targetOccupation[ i ].y ) {
          return false;
        }
      }
      // Check if target location sits within range
      if (
          targetOccupation[ i ].x < floor.boundaries.left ||
          targetOccupation[ i ].y < floor.boundaries.top ||
          targetOccupation[ i ].x > floor.gridWidth - 1 - floor.boundaries.right ||
          targetOccupation[ i ].y > floor.gridHeight - 1 - floor.boundaries.bottom
      )
        return false;
    }

    return true;
  }
}
