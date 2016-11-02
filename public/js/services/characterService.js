function characterService($http) {

  const currentCharacter = {};

  this.finalRace = (gender, race) => {
    currentCharacter.gender = gender;
    currentCharacter.race = race;
  }
}

module.exports = characterService;
