export default function () {
  const gameService = this;

  this.cameraFocus = ( renderer, scene, character ) => {
    var x = character.x - ( renderer.width - character.width ) / 2;
    var y = character.y - ( renderer.height - character.height ) / 2;
    scene.position.set( -x, -y );
  }

  this.createFloor = ( id, tileFileName, container, mapGridWidth, mapGridHeight, tileGridWidth, tileGridHeight ) => {
    for ( let i = 0; i < mapGridHeight; i++ ) {
      for ( let j = 0; j < mapGridWidth; j++ ) {
        var tile = new PIXI.Sprite( id[ `${ tileFileName }.png` ] );
        tile.position.set( j * tileGridWidth, i * tileGridHeight );

        container.addChild( tile );
      }
    }
  }

  this.createBoundaries = ( id, fileNames, container, mapGridWidth, mapGridHeight, tileGridWidth, tileGridHeight ) => {
    var boundaryLeft, boundaryRight, boundaryTop, boundaryBottom;

    for ( let i = 0; i < mapGridHeight; i++ ) {
      boundaryLeft = new PIXI.Sprite( id[ `${ fileNames.left }.png` ] );
      boundaryRight = new PIXI.Sprite( id[ `${ fileNames.right }.png` ] );

      boundaryLeft.position.set( 0, i * tileGridHeight );
      boundaryRight.position.set( mapGridWidth * tileGridWidth - boundaryRight.width, i * tileGridHeight );

      container.addChild( boundaryLeft );
      container.addChild( boundaryRight );
    }

    for ( let j = 0; j < mapGridWidth; j++ ) {
      boundaryTop = new PIXI.Sprite( id[ `${ fileNames.top }.png` ] );
      boundaryBottom = new PIXI.Sprite( id[ `${ fileNames.bottom }.png` ] );

      boundaryTop.position.set( j * tileGridWidth, 0 );
      boundaryBottom.position.set( j * tileGridWidth, mapGridHeight * tileGridHeight - boundaryBottom.height );

      container.addChild( boundaryTop );
      container.addChild( boundaryBottom );
    }

    return {
      left: boundaryLeft.width / tileGridWidth,
      top: boundaryTop.height / tileGridHeight,
      right: boundaryRight.width / tileGridWidth,
      bottom: boundaryBottom.height / tileGridHeight
    };
  }

  this.initializeObject = ( object, x, y, tileGridWidth, tileGridHeight, obstacles ) => {
    object.coordinate = { x, y };
    this.setGridWidthHeight( object, tileGridWidth, tileGridHeight );
    object.gridOccupation = this.setGridOccupation( object );
    this.addObstacles( object, obstacles );
    this.setPositionFromGrid( object, tileGridWidth, tileGridHeight );
  }

  this.setGridWidthHeight = ( object, tileGridWidth, tileGridHeight ) => {
    object.gridWidth = object.width / tileGridWidth;
    object.gridHeight = object.height / tileGridHeight;
  }

  this.setGridOccupation = ( object ) => {
    var result = [];

    for ( let i = 0; i < object.gridWidth; i++ ) {
      result.push( {
        x: object.coordinate.x + i,
        y: object.coordinate.y + object.gridHeight - 1
      } );
    }

    return result;
  }

  this.addHealthBar = ( object ) => {
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

  this.addObstacles = ( object, obstacles ) => {
    for ( let i = 0; i < object.gridOccupation.length; i++ ) {
      obstacles.push( object.gridOccupation[ i ] );
    }
  }

  this.removeObstacles = ( object, obstacles ) => {
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

  this.checkObstacles = ( targetOccupation, obstacles ) => {
    for ( let i = targetOccupation.length - 1; i >= 0; i-- ) {
      for ( let j = obstacles.length - 1; j >= 0; j-- ) {
        if ( obstacles[ j ].x === targetOccupation[ i ].x && obstacles[ j ].y === targetOccupation[ i ].y ) {
          return true;
        }
      }
    }

    return false;
  }

  this.setPositionFromGrid = ( object, tileGridWidth, tileGridHeight ) => {
    object.position.set( object.coordinate.x * tileGridWidth, object.coordinate.y * tileGridHeight );
  };

  this.contain = ( object, floor, targetOccupation ) => {
    for ( let i = targetOccupation.length - 1; i >= 0; i-- ) {
      if (
          targetOccupation[ i ].x < floor.container.left ||
          targetOccupation[ i ].y < floor.container.top ||
          targetOccupation[ i ].x > floor.gridWidth - 1 - floor.container.right ||
          targetOccupation[ i ].y > floor.gridHeight - 1 - floor.container.bottom
      )
        return false;
    }

    return true;
  }

  this.moveHealthBar = ( object ) => {
    object.healthBar.position.set( object.x, object.y - 2 * object.healthBar.barHeight );
  };

  this.engage = ( refObj, targetObj ) => {
    for ( let i = 0; i < refObj.gridOccupation.length; i++ ) {
      for ( let j = 0; j < targetObj.gridOccupation.length; j++ ) {
        if ( this.gridDistance( refObj.gridOccupation[ i ], targetObj.gridOccupation[ j ] ) <= 1 ) {
          return this.engageDirection( refObj.gridOccupation[ i ], targetObj.gridOccupation[ j ] );
        }
      }
    }

    return -1;
  };

  this.gridDistance = ( occupation1, occupation2 ) => {
    let dx = occupation1.x - occupation2.x;
    let dy = occupation1.y - occupation2.y;

    return Math.abs( dx ) + Math.abs( dy );
  };

  this.engageDirection = ( ref, target ) => {
    let dx = ref.x - target.x;
    let dy = ref.y - target.y;

    if ( dx > 0 )
      return 0;
    else if ( dy > 0 )
      return 1;
    else if ( dx < 0 )
      return 2;
    else if (  dy < 0 )
      return 3;
  }

  this.takeDmg = ( id, object, dmg, effect, name ) => {
    object.healthBar.children[ 1 ].width -= object.healthBar.children[ 0 ].width * dmg / 100;

    if ( object.healthBar.children[ 1 ].width < 0 )
      object.healthBar.children[ 1 ].width = 0;

    effect.position.set( object.x, object.y );

    requestAnimationFrame( gameService.takeDmgAnimation.bind( null, id, effect, name ) );
  }

  var effectCounter = 0;
  var animationFrequency = 5;

  this.takeDmgAnimation = ( id, effect, name ) => {
    effect.visible = true;
    effectCounter++;

    if ( effectCounter >= animationFrequency * effect.numOfTextures ) {
      effectCounter = 0;
      effect.visible = false;
      return;
    }

    this.animation( id, effect, name, Math.floor( effectCounter / animationFrequency ) );
    requestAnimationFrame( gameService.takeDmgAnimation.bind( null, id, effect, name ) );
  }

  this.animation = ( id, object, name, counter ) => {
    object.texture = id[ `${ name }${ object.direction }${ counter }.png` ];
  };

  this.randomMove = ( object, obstacles, floor, tileGridWidth, tileGridHeight ) => {
    var direction = Math.floor( Math.random() * 4 ) + 37;

    this.move( object, obstacles, floor, tileGridWidth, tileGridHeight, direction );
  };

  this.keyboard = ( object, obstacles, floor, tileGridWidth, tileGridHeight ) => {
    var key = {
      keyUp: true,

      downHandler() {
        if ( this.keyUp ) {
          this.keyUp = false;
          gameService.move( object, obstacles, floor, tileGridWidth, tileGridHeight, event.keyCode );
        }
      },

      upHandler() {
        this.keyUp = true;
      }
    };

    window.addEventListener ( "keydown", key.downHandler.bind( key ), false );
    window.addEventListener ( "keyup", key.upHandler.bind( key ), false );

    return key;
  };

  this.move = ( object, obstacles, floor, tileGridWidth, tileGridHeight, direction ) => {
    this.removeObstacles( object, obstacles );

    let targetOccupation;

    switch( direction ) {
      case 37:
        targetOccupation = this.setGridOccupation( {
          coordinate: { x: object.coordinate.x - 1, y: object.coordinate.y }, gridWidth: object.gridWidth, gridHeight: object.gridHeight
        } );

        if ( !this.checkObstacles( targetOccupation, obstacles ) && this.contain( object, floor, targetOccupation ) )
          object.coordinate.x--;

        object.direction = 0;
        break;

      case 38:
        targetOccupation = this.setGridOccupation( {
          coordinate: { x: object.coordinate.x, y: object.coordinate.y - 1 }, gridWidth: object.gridWidth, gridHeight: object.gridHeight
        } );

        if ( !this.checkObstacles( targetOccupation, obstacles ) && this.contain( object, floor, targetOccupation ) )
          object.coordinate.y--;

        object.direction = 1;
        break;

      case 39:
        targetOccupation = this.setGridOccupation( {
          coordinate: { x: object.coordinate.x + 1, y: object.coordinate.y }, gridWidth: object.gridWidth, gridHeight: object.gridHeight
        } );

        if ( !this.checkObstacles( targetOccupation, obstacles ) && this.contain( object, floor, targetOccupation ) )
          object.coordinate.x++;

        object.direction = 2;
        break;

      case 40:
      targetOccupation = this.setGridOccupation( {
        coordinate: { x: object.coordinate.x, y: object.coordinate.y + 1 }, gridWidth: object.gridWidth, gridHeight: object.gridHeight
      } );

        if ( !this.checkObstacles( targetOccupation, obstacles ) && this.contain( object, floor, targetOccupation ) )
          object.coordinate.y++;

        object.direction = 3;
        break;
    }

    object.gridOccupation = this.setGridOccupation( object, tileGridWidth, tileGridHeight );
    this.addObstacles( object, obstacles );
    this.setPositionFromGrid( object, tileGridWidth, tileGridHeight );
  }
}
