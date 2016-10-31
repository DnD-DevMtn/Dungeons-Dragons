import "pixi.js";

export default function() {
  const resources = PIXI.loader.resources;

  const renderer = new PIXI.autoDetectRenderer(512,384,
    {antialias: true, transparent: true, resolution: 1}
  );
  const login = document.getElementById("login-parallax");
  const stage = new PIXI.Container();
  login.appendChild(renderer.view);


  let far, mid, close;

  PIXI.loader
    .add("../../assets/login-sprites.json")
    .load(setup);


  function setup() {

            close = new PIXI.extras.TilingSprite(
              resources["../../assets/login-sprites.json"].textures["town.png"],512, 512
            );
            mid = new PIXI.extras.TilingSprite(
              resources["../../assets/login-sprites.json"].textures["church-castle.png"],
              512, 512
            );
            far = new PIXI.extras.TilingSprite(
              resources["../../assets/login-sprites.json"].textures["castle1.png"],
              512, 512
            );
            far.position.x = 0;
            far.position.y = -30;
            far.tilePosition.x = 0;
            far.tilePosition.y = 0;
            stage.addChild(far);
            mid.position.x = 0;
            mid.position.y = -15;
            mid.tilePosition.x = 0;
            mid.tilePosition.y = 0;
            stage.addChild(mid);
            close.position.x = 0;
            close.position.y = 128;
            close.tilePosition.x = 0;
            close.tilePosition.y = 0;
            stage.addChild(close);
            requestAnimationFrame(update);
         }
         function update() {
            close.tilePosition.x -= 0.32;
            mid.tilePosition.x -= 0.128;
            far.tilePosition.x -= 0.064;

            renderer.render(stage);
            requestAnimationFrame(update);
         }
}
