import "pixi.js";

export default function( $scope ) {
  var p = new Game( dataStructureBuffer( $scope ) );

  $scope.$on( "send move", ( event, data ) => {
    p.move( data.character, data.target );
  } );

  $scope.$on( "attack", ( event, data ) => {
    p.attack( data.source, data.target, data.damage );
  } );
};

function dataStructureBuffer( scope ) {
  scope.Dungeon = scope.GV.pixiDungeon;

  for ( let i = 0; i < scope.Dungeon.players.length; i++ )
    scope.Dungeon.players[ i ].image = scope.Dungeon.players[ i ].actor.sprite;

  scope.Dungeon.mainPlayer = {
    id: scope.Dungeon.players[ 0 ].id,
    cameraGridWidth: 15,
    cameraGridHeight: 15
  };

  return scope;
}

class Game {
  constructor( scope ) {
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
    this.effectCounter = 0;
    this.scope = scope;
    this.mainPlayerId = scope.Dungeon.mainPlayer.id;
    this.floor.gridWidth = scope.Dungeon.width;
    this.floor.gridHeight = scope.Dungeon.height;
    this.floor.tileImage = scope.Dungeon.backgroundImage;
    this.floor.gridOccupation = [ { x: -1, y: -1 } ];
    this.players = scope.Dungeon.players;
    this.monsters = scope.Dungeon.monsters;
    this.doors = scope.Dungeon.doors;
    this.environment = scope.Dungeon.environment;

    // this.renderer = PIXI.autoDetectRenderer( Dungeon.mainPlayer.cameraGridWidth * this.tileGridWidth,
    //   Dungeon.mainPlayer.cameraGridHeight * this.tileGridHeight );
    // Full map view
    this.renderer = PIXI.autoDetectRenderer( this.floor.gridWidth * this.tileGridWidth, this.floor.gridHeight * this.tileGridHeight  )

    document.getElementById( "pixi-in-game" ).appendChild( this.renderer.view );

    PIXI.loader.add( "./assets/GameImages/sprite.json" ).load( this.initView.bind( this ) );
  }

  initView() {
    this.id = PIXI.loader.resources[ "./assets/GameImages/sprite.json" ].textures;

    this.createFloor();
    this.placeActors( this.players );
    this.placeActors( this.monsters );
    this.placeProps( this.doors );
    this.placeProps( this.environment );
    this.play();
  }

  play() {
    // this.cameraFocus();
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
      boundaryLeft = new PIXI.Sprite( this.id[ `BOUNDARY0.png` ] );
      boundaryRight = new PIXI.Sprite( this.id[ `BOUNDARY2.png` ] );

      boundaryLeft.position.set( 0, i * this.tileGridHeight );
      boundaryRight.position.set(
        this.floor.gridWidth * this.tileGridWidth - boundaryRight.width,
        i * this.tileGridHeight
      );

      this.floor.addChild( boundaryLeft );
      this.floor.addChild( boundaryRight );
    }

    for ( let j = 0; j < this.floor.gridWidth; j++ ) {
      boundaryTop = new PIXI.Sprite( this.id[ `BOUNDARY1.png` ] );
      boundaryBottom = new PIXI.Sprite( this.id[ `BOUNDARY3.png` ] );

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
      actor.direction = 3; // left: 0, top: 1, right: 2, bottom: 3
      actor.id = characters[ i ].id;

      this.initProperty( actor, characters[ i ] );

      this.actors[ characters[ i ].id ] = actor;

      this.gameUtil.addHealthBar( actor );
      this.gameScene.addChild( actor.healthBar );

      actor.interactive = true;
      actor.scope = this.scope;
      actor.mousedown = function( data ) {
        this.scope.$emit( 'actor clicked', { id: this.id, location: this.coordinate } );
      };
    }
  }

  placeProps( properties ) {
    var prop;

    for ( let i = 0; i < properties.length; i++ ) {
      prop = new PIXI.Sprite( this.id[ `${ properties[ i ].image }.png` ] );

      this.initProperty( prop, properties[ i ] );
    }
  }

  initProperty( role, script ) {
    role.image = script.image;
    this.gameUtil.setGridWidthHeight( role, this.tileGridWidth, this.tileGridHeight );
    role.coordinate = this.gameUtil.gridCoordinate( role, script );
    role.gridOccupation = this.gameUtil.gridOccupation( role );
    this.gameUtil.addObstacle( role, this.obstacles );
    this.gameUtil.setPositionFromGrid( role, this.tileGridWidth, this.tileGridHeight );

    this.gameScene.addChild( role );
    this.gameUtil.orderProps( this.gameScene.children );
  }

  animation() {
    this.animationCounter %= 100;

    for ( let i in this.actors ) {
      this.actors[ i ].texture = this.id[
        `${ this.actors[ i ].image }${ this.actors[ i ].direction }${ Math.floor( this.animationCounter / 25 ) }.png`
      ];

      this.actors[ i ].healthBar.position.set( this.actors[ i ].x, this.actors[ i ].y - 2 * this.actors[ i ].healthBar.barHeight );
    }

    this.animationCounter++;
  }

  cameraFocus() {
    var x = this.actors[ this.mainPlayerId ].x - ( this.renderer.width - this.actors[ this.mainPlayerId ].width ) / 2;
    var y = this.actors[ this.mainPlayerId ].y - ( this.renderer.height - this.actors[ this.mainPlayerId ].height ) / 2;
    this.gameScene.position.set( -x, -y );
  }

  move( character, targetLocation ) {
    var result = false;
    var actor = this.actors[ character.id ];

    var targetOccupation = this.gameUtil.gridOccupation( {
      coordinate: targetLocation, gridWidth: actor.gridWidth, gridHeight: actor.gridHeight
    } );

    this.gameUtil.removeObstacle( actor, this.obstacles );
    actor.direction = this.gameUtil.getObjectDirection( actor, targetLocation );

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

  attack( source, target, damage ) {
    var attacker = this.actors[ source.id ];
    var victim = this.actors[ target.id ];
    attacker.direction = this.gameUtil.getObjectDirection( attacker, victim );

    this.attackAnimation( victim );

    var hpRatioRemaining = ( target.settings.hp - damage ) / target.settings.hp;

    if ( hpRatioRemaining <= 0 )
      victim.healthBar.children[ 1 ].width = 0;
    else
      victim.healthBar.children[ 1 ].width *= hpRatioRemaining;
  }

  attackAnimation( victim ) {
    var effect;

    if ( this.effectCounter === 0 ) {
      effect = new PIXI.Sprite( this.id[ `ATTACK0.png` ] );
      effect.coordinate = { x: victim.coordinate.x, y: victim.coordinate.y };
      this.gameUtil.setPositionFromGrid( effect, this.tileGridWidth, this.tileGridHeight );
      this.gameScene.addChild( effect );
    } else if ( this.effectCounter < 100 ) {
      effect.texture = this.id[ `ATTACK${ this.effectCounter % 20 }.png` ];
    } else {
      this.gameScene.removeChild( effect );
      this.effectCounter = 0;
    }

    this.effectCounter++;

    requestAnimationFrame( this.attackAnimation.bind( this, victim ) );
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
        return 1;
      else if ( !prop2.gridOccupation )
        return -1;
      else
        return prop1.gridOccupation[ 0 ].y - prop2.gridOccupation[ 0 ].y ;
    } )
  }

  getObjectDirection( source, target ) {console.log( "getting direction: ", target, source );
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

  addHealthBar( object ) {
    object.healthBar = new PIXI.Container();
    object.healthBar.barWidth = object.width;
    object.healthBar.barHeight = 4;
    object.healthBar.position.set( object.x, object.y - 2 * object.healthBar.barHeight );

    var innerBar = new PIXI.Graphics();
    innerBar.beginFill( 0xFF3300 );
    innerBar.drawRect( 0, 0, object.healthBar.barWidth, object.healthBar.barHeight );
    innerBar.endFill();
    object.healthBar.addChild( innerBar );

    var outerBar = new PIXI.Graphics();
    outerBar.beginFill( 0x27E11E );
    outerBar.drawRect( 0, 0, object.healthBar.barWidth, object.healthBar.barHeight );
    outerBar.endFill();
    object.healthBar.addChild( outerBar );
  }
}
