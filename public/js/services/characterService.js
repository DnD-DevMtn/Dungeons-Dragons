function characterService($http, $state, userService) {

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

  this.finalStats = (str, dex, con, int, wis, cha, room, campaign) => {
    let classId;

    currentCharacter.baseStats.str = str;
    currentCharacter.baseStats.dex = dex;
    currentCharacter.baseStats.con = con;
    currentCharacter.baseStats.int = int;
    currentCharacter.baseStats.wis = wis;
    currentCharacter.baseStats.cha = cha;
    currentCharacter.money = {
      gold: 50
    }
    if(currentCharacter.classType === "Fighter"){
      classId = "5818cf737e79500420928e5d";
      currentCharacter.weapons = ["581a5e0aaba7c616582a7afe"];
      currentCharacter.armor = ["581a653dfc9a0f0b2a47a842"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "FIGHTER";
      currentCharacter.hp = (10 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Rogue"){
      classId = "5818cff07e79500420928e5e";
      currentCharacter.weapons = ["5817d7626b784f1c14e36f5e", "581a47ef959c9233f0f9eaac", "581a5fff89e4592710b834dd"];
      currentCharacter.armor = ["581a51762709d90a714c18d0"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "ROGUE";
      currentCharacter.hp = (6 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Sorcerer"){
      classId = "581b56450be6891a5843f1c1";
      currentCharacter.weapons = ["581a54c43045432ae855bb55"];
      currentCharacter.armor = ["581a652cfc9a0f0b2a47a841"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "SORCERER";
      currentCharacter.hp = (6 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    } else if(currentCharacter.classType === "Cleric"){
      classId = "581b5cc00be6891a5843f1c2";
      currentCharacter.weapons = ["581a50f6c97475280cf88209"];
      currentCharacter.armor = ["581a6549fc9a0f0b2a47a844"];
      currentCharacter.gear = ["581a5a142709d90a714c18e5"];
      currentCharacter.sprite = "CLERIC";
      currentCharacter.hp = (8 * currentCharacter.level) + (Math.floor(con - 10) / 2);
    }
    if(currentCharacter.race === "Dwarf"){
      currentCharacter.speed = 4;
    } else if(currentCharacter.race === "Human"){
      currentCharacter.speed = 6;
    } else if(currentCharacter.race === "Elf"){
      currentCharacter.speed = 6;
    } else if(currentCharacter.race === "Gnome"){
      currentCharacter.speed = 4;
    } else if(currentCharacter.race === "Halfling"){
      currentCharacter.speed = 4;
    } else if(currentCharacter.race === "Half Orc"){
      currentCharacter.speed = 6;
    }
    getBaseAttack(classId, currentCharacter.level).then(baseAttack => {
      currentCharacter.baseAttack = baseAttack;
      $http.put(`/api/campaigns/join/${room}`, {facebookId: userService.user.facebookId, character: currentCharacter});
      $http.put(`/api/users/${currentUser}`, currentCharacter).then(user => {
        $http.get(`/api/users/${user.data._id}`).then(updatedUser => {
          const finalCharacter = userService.user.character = updatedUser.data.characters[updatedUser.data.characters.length - 1];
          $state.go("lobby", {campaign: campaign, gameId: room, userChar: finalCharacter})
        });
      })
        //userService.user.character = currentCharacter;
      //$state.go("lobby", {campaign: campaign, gameId: room, userChar: currentCharacter})
    });
  }

  this.getUser();

  function getBaseAttack(classId, level) {
    return $http.get(`/api/classes/${classId}`).then(classResponse => {
      return classResponse.data.classLvl[level - 1].baseAttack;
    });
  }
}

module.exports = characterService;
