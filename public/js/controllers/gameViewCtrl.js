/*
This is the parent ctrl of everything game related. It should talk to the Pixi
engine, the game Engine, and the gameInfo Ctrls.
 */
export default function(engineService, userService, sockets) {
  const GV = this;

  GV.user = userService.user;
}
