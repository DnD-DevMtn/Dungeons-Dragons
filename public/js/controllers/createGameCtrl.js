export default function($http, $state, createGameService, userService) {
  const create = this;
  create.postCampaign = (campaign) => {
    userService.user.character = {name:"dm"};
    campaign.dm = {
      name: `${userService.user.firstName } ${userService.user.lastName}`,
      facebookId: userService.user.facebookId
    }
    campaign.status = "open";
    const data = {
      campaign,
      facebookId: userService.user.facebookId
    }
    createGameService.postCampaign(data).then(response => {
      $state.go('lobby', {campaign:response.data, gameId:response.data._id, userChar: userService.user.character});
    });
  }

  create.createFloor = function() {
    var dungeon = {
      name: create.name,
      width: create.width,
      height: create.height,
      tileImage: create.tileImage
    };
    delete create.width;
    delete create.height;

    create.dungeonBuilder = new DungeonBuilder( dungeon );
  }

  create.imageSelected = function( image, type, settings ) {
    create.dungeonBuilder.deleteSelected = false;
    create.dungeonBuilder.property = { image, type, settings };
    create.dungeonBuilder.deleteShadow();
    create.dungeonBuilder.createShadow();
  }

  create.deleteSelected = function() {
    delete create.dungeonBuilder.property;
    create.dungeonBuilder.deleteShadow();
    create.dungeonBuilder.deleteSelected = true;
  }

  create.saveDungeon = function() {
    PIXI.loader.reset();
    createGameService.postDungeon( create.dungeonBuilder.dungeon ).then( response => {
    } );
  }
}

class DungeonBuilder {
  constructor( dungeon ) {
    this.gameUtil = new Game_Util();

    this.stage = new PIXI.Container();
    this.gameScene = new PIXI.Container();
    this.floor = new PIXI.Container();

    this.gameScene.addChild( this.floor );
    this.stage.addChild( this.gameScene );
    this.obstacles = [];

    this.tileGridWidth = 40;
    this.tileGridHeight = 40;

    this.name = dungeon.name;
    this.floor.gridWidth = dungeon.width;
    this.floor.gridHeight = dungeon.height;
    this.floor.tileImage = dungeon.tileImage;
    this.createDungeon();

    this.renderer = PIXI.autoDetectRenderer( this.floor.gridWidth * this.tileGridWidth, this.floor.gridHeight * this.tileGridWidth );
    document.getElementById( "pixi-map-builder" ).appendChild( this.renderer.view );

    PIXI.loader.add( "./assets/GameImages/sprite.json" ).load( this.initView.bind( this ) );
  }

  initView() {
    this.id = PIXI.loader.resources[ "./assets/GameImages/sprite.json" ].textures;

    this.createFloor();
    this.updateView();
  }

  updateView() {
    this.renderer.render( this.stage );

    requestAnimationFrame( this.updateView.bind( this ) );
  }

  createFloor() {
    var tile;

    // Compose floor tiles
    for ( let i = 0; i < this.floor.gridHeight; i++ ) {
      for ( let j = 0; j < this.floor.gridWidth; j++ ) {
        tile = new PIXI.Sprite( this.id[ `${ this.floor.tileImage }.png` ] );
        tile.position.set( j * this.tileGridWidth, i * this.tileGridHeight );

        tile.interactive = true;

        tile.mouseover = function( data ) {
          if ( this.property ) {
            this.property.location = { x: j, y: i };
            this.moveShadow();
          }
        }.bind( this );

        tile.mousedown = function( data ) {
          if ( this.deleteSelected ) {
            this.deleteProp( { x: j, y: i } );
          }
          else
            this.placeProp();
        }.bind( this );

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

    var line

    // Draw vertical grids
    for ( let i = 0; i < this.floor.gridWidth; i++ ) {
      line = new PIXI.Graphics();
      line.lineStyle( 1, 0x538D4E, 1 );
      line.moveTo( 0, 0 );
      line.lineTo( 0, this.floor.gridHeight * this.tileGridHeight );
      line.position.set( i * this.tileGridWidth, 0 );

      this.floor.addChild( line );
    }

    // Draw horizontal grids
    for ( let j = 0; j <  this.floor.gridHeight; j++ ) {
      line = new PIXI.Graphics();
      line.lineStyle( 1, 0x538D4E, 1 );
      line.moveTo( 0, 0 );
      line.lineTo( this.floor.gridWidth * this.tileGridWidth, 0 );
      line.position.set( 0, j * this.tileGridHeight );

      this.floor.addChild( line );
    }
  }

  deleteShadow() {
    this.gameScene.removeChild( this.shadow );
  }

  createShadow() {
    this.shadow = new PIXI.Sprite( this.id[ `${ this.property.image }.png` ] );
    this.shadow.alpha = 0.7;
    this.gameUtil.setGridWidthHeight( this.shadow, this.tileGridWidth, this.tileGridHeight );
    this.gameScene.addChild( this.shadow );
  }

  moveShadow() {
    this.shadow.coordinate = this.gameUtil.gridCoordinate( this.shadow, this.property );
    this.shadow.gridOccupation = this.gameUtil.gridOccupation( this.shadow );

    this.gameUtil.setPositionFromGrid( this.shadow, this.tileGridWidth, this.tileGridHeight );
  }

  deleteProp( coordinate ) {
    var objectOccupation;

    for ( let i = 0; i < this.gameScene.children.length; i++ ) {
      objectOccupation = this.gameScene.children[ i ].gridOccupation;

      if ( objectOccupation ) {
        for ( let j = 0; j < objectOccupation.length; j++ ) {
          if ( objectOccupation[ j ].x === coordinate.x && objectOccupation[ j ].y === coordinate.y ) {
            this.deleteDungeonProp( this.gameScene.children[ i ] );

            this.gameUtil.removeObstacle( this.gameScene.children[ i ], this.obstacles );
            this.gameScene.removeChild( this.gameScene.children[ i ] );
            // console.log( this.dungeon );

            return;
          }
        }
      }
    }
  }

  placeProp() {
    var prop = new PIXI.Sprite( this.id[ `${ this.property.image }.png` ] );
    prop.type = this.property.type;
    this.gameUtil.setGridWidthHeight( prop, this.tileGridWidth, this.tileGridHeight );
    prop.coordinate = this.gameUtil.gridCoordinate( prop, this.property );
    prop.gridOccupation = this.gameUtil.gridOccupation( prop );

    if ( this.gameUtil.validateTargetLocation( prop.gridOccupation, this.obstacles, this.floor ) ) {
      this.gameUtil.setPositionFromGrid( prop, this.tileGridWidth, this.tileGridHeight );
      this.gameScene.addChild( prop );
      this.gameUtil.orderProps( this.gameScene.children );
      this.gameUtil.addObstacle( prop, this.obstacles );

      this.saveDungeonProp( this.property );
      // console.log( this.dungeon );
    }
  }

  createDungeon() {
    this.dungeon = {
      name: this.name,
      height: this.floor.gridHeight,
      width: this.floor.gridWidth,
      backgroundImage: this.floor.tileImage,
      monsters: [],
      environment: [],
      doors: [],
      traps: [],
      items: {
        armor: [],
        weapons: [],
        gear: []
      },
      players: []
    };
  }

  saveDungeonProp( property ) {
    var dungeonProp = {
      id: ( new Date() ).getTime(),
      image: property.image,
      location: {
        x: property.location.x,
        y: property.location.y
      },
      settings: property.settings
    };

    if ( property.type === "armor" || property.type === "weapons" || property.type === "gear" )
      this.dungeon.items[ property.type ].push( dungeonProp );
    else
      this.dungeon[ property.type ].push( dungeonProp );
  }

  deleteDungeonProp( sprite ) {
    var dungeonProps;

    if ( sprite.type === "armor" || sprite.type === "weapons" || sprite.type === "gear" )
      dungeonProps = this.dungeon.items[ sprite.type ];
    else
      dungeonProps = this.dungeon[ sprite.type ];

    for ( let i = 0; i < dungeonProps.length; i++ ) {
      if ( sprite.gridOccupation[ 0 ].x === dungeonProps[ i ].location.x
        && sprite.gridOccupation[ 0 ].y === dungeonProps[ i ].location.y ) {
        dungeonProps.splice( i, 1 );
      }
    }
  }
}

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
