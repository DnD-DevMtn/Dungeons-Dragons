function characterService($http, $state) {

  let currentUser = "";

  this.getUser = () => {
    return $http.get("/api/facebook").then(response => {
      currentUser = response.data._id;
    });
  }

  const currentCharacter = {
    baseStats : {},
    descprition : {}
  };

  this.finalRace = (gender, race) => {
    currentCharacter.descprition.sex = gender;
    currentCharacter.race = race;
  }

  this.finalClass = (name, characterClass, alignment, level) => {
    currentCharacter.name = name;
    currentCharacter.classType = characterClass;
    currentCharacter.alignment = alignment;
    currentCharacter.level = level;
  }

  this.finalStats = (str, dex, con, int, wis, cha, room) => {
    currentCharacter.baseStats.str = str;
    currentCharacter.baseStats.dex = dex;
    currentCharacter.baseStats.con = con;
    currentCharacter.baseStats.int = int;
    currentCharacter.baseStats.wis = wis;
    currentCharacter.baseStats.cha = cha;
    if(currentCharacter.classType === "Fighter"){
      currentCharacter.weapons = ["581a5e0aaba7c616582a7afe"];
      currentCharacter.armor = ["581a653dfc9a0f0b2a47a842"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "FIGHTER";
      currentCharacter.hp = (10 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Rogue"){
      currentCharacter.weapons = ["5817d7626b784f1c14e36f5e", "581a47ef959c9233f0f9eaac", "581a5fff89e4592710b834dd"];
      currentCharacter.armor = ["581a51762709d90a714c18d0"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "ROGUE";
      currentCharacter.hp = (6 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Sorcerer"){
      currentCharacter.weapons = ["581a54c43045432ae855bb55"];
      currentCharacter.armor = ["581a652cfc9a0f0b2a47a841"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "SORCERER";
      currentCharacter.hp = (6 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Cleric"){
      currentCharacter.weapons = ["581a50f6c97475280cf88209"];
      currentCharacter.armor = ["581a6549fc9a0f0b2a47a844"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "CLERIC";
      currentCharacter.hp = (8 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    }
    console.log(currentCharacter);
    $http.put(`/api/users/${currentUser}`, currentCharacter);
    $http.put(`/api/campaigns/join/${room}`, currentCharacter);
    $state.go("lobby", {gameId: room, userChar: currentCharacter});
  }

  this.getUser();
}

module.exports = characterService;
