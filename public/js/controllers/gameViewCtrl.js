/*
This is the parent ctrl of everything game related. It should talk to the Pixi
engine, the game Engine, and the gameInfo Ctrls.
 */
export default function(engineService, userService, socket, $stateParams) {
  const GV = this;

  GV.user = userService.user;

  GV.party = $stateParams.party;

  socket.on("return move", data => {

  });

  socket.on("return bash", data => {

  });

  socket.on("return openDoor", data => {

  });

  socket.on("return closeDoor", data => {

  });

  socket.on("return perception", data => {

  });

  socket.on("return rogueTrapFind", data => {

  });

  socket.on("return rogueDisarmTrap", data => {

  });

  socket.on("return pickUpItem", data => {

  });

  socket.on("return dropItem", data => {

  });

  socket.on("return melee", data => {

  });

  socket.on("return fighterPowerAttack", data => {

  });

  socket.on("return fighterCleave", data => {

  });

  socket.on("return castSpell", data => {

  });

  socket.on("return rogueSneakAttack", data => {

  });

  socket.on("rogueTrapFind", data => {

  });





}
