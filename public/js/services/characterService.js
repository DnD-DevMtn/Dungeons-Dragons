function characterService($http) {

  const currentCharacter = {};

  this.finalRace = (gender, race) => {
    currentCharacter.gender = gender;
    currentCharacter.race = race;
    console.log(currentCharacter);
  }

  this.finalClass = (name, characterClass, alignment, level) => {
    currentCharacter.name = name;
    currentCharacter.classType = characterClass;
    currentCharacter.alignment = alignment;
    currentCharacter.totalLvl = level;
    console.log(currentCharacter);
  }
}

module.exports = characterService;
