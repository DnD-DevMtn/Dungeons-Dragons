function characterService($http) {

  const currentCharacter = {};

  this.finalRace = (gender, race) => {
    currentCharacter.gender = gender;
    currentCharacter.race = race;
  }

  this.finalClass = (name, characterClass, alignment, level) => {
    currentCharacter.name = name;
    currentCharacter.classType = characterClass;
    currentCharacter.alignment = alignment;
    currentCharacter.totalLvl = level;
  }
}

module.exports = characterService;
