function characterBuilderCtrl($scope, characterService, $stateParams) {

    $scope.room = $stateParams.room;
    $scope.campaign = $stateParams.campaign;

    let activeSection = "race";
    
    $scope.selectedRaceTitle = "Human";
    $scope.showMales = true;
    $scope.showFemales = false;
    $scope.selectedMale = "active";
    $scope.selectedFemale = "";
    $scope.humanMale = "active";
    $scope.humanFemale = "active";
    $scope.elfMale = "";
    $scope.elfFemale = "";
    $scope.dwarfMale = "";
    $scope.dwarfFemale = "";
    $scope.halfOrcMale = "";
    $scope.halfOrcFemale = "";
    $scope.halflingMale = "";
    $scope.halflingFemale = "";
    $scope.gnomeMale = "";
    $scope.gnomeFemale = "";
    $scope.selectedRace = "../../images/races/male-human.jpg";
    $scope.pickedGender = "male";
    $scope.pickedRace = "Human";
    $scope.prevActive = true;
    $scope.alignments = ["Lawfully Good", "Lawfully Neutral", "Lawfully Evil", "Neutral Good", "True Neutral", "Neutral Evil", "Chaotic Good", "Chaotic Neutral", "Chaotic Evil"];
    $scope.selectedClass = "";
    $scope.fighter = "";
    $scope.cleric = "";
    $scope.rogue = "";
    $scope.sorcerer = "";
    $scope.characterName;
    $scope.characterAlignment = "Lawfully Good"
    $scope.selectedLevel = 1;
    $scope.levelOne = "active";
    $scope.levelTwo, $scope.levelThree, $scope.levelFour, $scope.levelFive, $scope.levelSix, $scope.levelSeven, $scope.levelEight, $scope.levelNine, $scope.levelTen;
    $scope.baseStatsPoints = 10;
    $scope.baseStr = 10;
    $scope.baseDex = 10;
    $scope.baseCon = 10;
    $scope.baseInt = 10;
    $scope.baseWis = 10;
    $scope.baseCha = 10;
    $scope.showNext = true;
    $scope.showFinish = false;

    $scope.selectFemales = () => {
      $scope.selectedRace = "../../images/races/female-human.jpg";
      $scope.showFemales = true;
      $scope.showMales = false;
      $scope.selectedMale = "";
      $scope.selectedFemale = "active";
      $scope.humanFemale = "active";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Human";
      $scope.pickedGender = "female";
    }

    $scope.selectMales = () => {
      $scope.selectedRace = "../../images/races/male-human.jpg";
      $scope.showFemales = false;
      $scope.showMales = true;
      $scope.selectedMale = "active";
      $scope.selectedFemale = "";
      $scope.humanMale = "active";
      $scope.elfMale = "";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Human";
      $scope.pickedGender = "male";
    }

    $scope.selectHumanMale = () => {
      $scope.selectedRace = "../../images/races/male-human.jpg";
      $scope.humanMale = "active";
      $scope.elfMale = "";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Human";
    }

    $scope.selectElfMale = () => {
      $scope.selectedRace = "../../images/races/male-elf.jpg";
      $scope.humanMale = "";
      $scope.elfMale = "active";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Elf";
    }

    $scope.selectDwarfMale = () => {
      $scope.selectedRace = "../../images/races/male-dwarf.jpg";
      $scope.humanMale = "";
      $scope.elfMale = "";
      $scope.dwarfMale = "active";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Dwarf";
    }

    $scope.selectHalfOrcMale = () => {
      $scope.selectedRace = "../../images/races/male-half-orc.jpg";
      $scope.humanMale = "";
      $scope.elfMale = "";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "active";
      $scope.halflingMale = "";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Half Orc";
    }

    $scope.selectHalflingMale = () => {
      $scope.selectedRace = "../../images/races/male-halfling.jpg";
      $scope.humanMale = "";
      $scope.elfMale = "";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "active";
      $scope.gnomeMale = "";
      $scope.selectedRaceTitle = "Halfling";
    }

    $scope.selectGnomeMale = () => {
      $scope.selectedRace = "../../images/races/male-gnome.jpg";
      $scope.humanMale = "";
      $scope.elfMale = "";
      $scope.dwarfMale = "";
      $scope.halfOrcMale = "";
      $scope.halflingMale = "";
      $scope.gnomeMale = "active";
      $scope.selectedRaceTitle = "Gnome";
    }

    $scope.selectHumanFemale = () => {
      $scope.selectedRace = "../../images/races/female-human.jpg";
      $scope.humanFemale = "active";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Human";
    }

    $scope.selectElfFemale = () => {
      $scope.selectedRace = "../../images/races/female-elf.jpg";
      $scope.humanFemale = "";
      $scope.elfFemale = "active";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Elf";
    }

    $scope.selectDwarfFemale = () => {
      $scope.selectedRace = "../../images/races/female-dwarf.jpg";
      $scope.humanFemale = "";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "active";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Dwarf";
    }

    $scope.selectHalfOrcFemale = () => {
      $scope.selectedRace = "../../images/races/female-half-orc.jpg";
      $scope.humanFemale = "";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "active";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Half Orc";
    }

    $scope.selectHalflingFemale = () => {
      $scope.selectedRace = "../../images/races/female-halfling.jpg";
      $scope.humanFemale = "";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "active";
      $scope.gnomeFemale = "";
      $scope.selectedRaceTitle = "Halfling";
    }

    $scope.selectGnomeFemale = () => {
      $scope.selectedRace = "../../images/races/female-gnome.jpg";
      $scope.humanFemale = "";
      $scope.elfFemale = "";
      $scope.dwarfFemale = "";
      $scope.halfOrcFemale = "";
      $scope.halflingFemale = "";
      $scope.gnomeFemale = "active";
      $scope.selectedRaceTitle = "Gnome";
    }

    $scope.selectClass = characterClass => {
      $scope.selectedClass = characterClass;
      $scope.fighter = "";
      $scope.cleric = "";
      $scope.rogue = "";
      $scope.sorcerer = "";
      if(characterClass === "Fighter"){
        $scope.fighter = "active";
      } else if(characterClass === "Cleric"){
        $scope.cleric = "active";
      } else if(characterClass === "Rogue"){
        $scope.rogue = "active";
      } else if(characterClass === "Sorcerer"){
        $scope.sorcerer = "active";
      }
    };

    $scope.selectLevel = level => {
      $scope.selectedLevel = level;
      $scope.levelOne = "";
      $scope.levelTwo = "";
      $scope.levelThree = "";
      $scope.levelFour = "";
      $scope.levelFive = "";
      $scope.levelSix = "";
      $scope.levelSeven = "";
      $scope.levelEight = "";
      $scope.levelNine = "";
      $scope.levelTen = "";
      if(level === 1) {
        $scope.selectedLevel = 1;
        $scope.levelOne = "active";
      } else if(level === 2){
        $scope.selectedLevel = 2;
        $scope.levelTwo = "active";
      } else if(level === 3){
        $scope.selectedLevel = 3;
        $scope.levelThree = "active";
      } else if(level === 4){
        $scope.selectedLevel = 4;
        $scope.levelFour = "active";
      } else if(level === 5){
        $scope.selectedLevel = 5;
        $scope.levelFive = "active";
      } else if(level === 6){
        $scope.selectedLevel = 6;
        $scope.levelSix = "active";
      } else if(level === 7){
        $scope.selectedLevel = 7;
        $scope.levelSeven = "active";
      } else if(level === 8){
        $scope.selectedLevel = 8;
        $scope.levelEight = "active";
      } else if(level === 9){
        $scope.selectedLevel = 9;
        $scope.levelNine = "active";
      } else if(level === 10){
        $scope.selectedLevel = 10;
        $scope.levelTen = "active";
      }
    }

    $scope.addToStr = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseStr ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromStr = () => {
      if($scope.baseStr > 0){
        $scope.baseStr --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.addToDex = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseDex ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromDex = () => {
      if($scope.baseDex > 0){
        $scope.baseDex --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.addToCon = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseCon ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromCon = () => {
      if($scope.baseCon > 0){
        $scope.baseCon --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.addToInt = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseInt ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromInt = () => {
      if($scope.baseInt > 0){
        $scope.baseInt --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.addToWis = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseWis ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromWis = () => {
      if($scope.baseWis > 0){
        $scope.baseWis --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.addToCha = () => {
      if($scope.baseStatsPoints > 0){
        $scope.baseCha ++;
        $scope.baseStatsPoints --;
      }
    }

    $scope.minusFromCha = () => {
      if($scope.baseCha > 0){
        $scope.baseCha --;
        $scope.baseStatsPoints ++;
      }
    }

    $scope.next = () => {
      if(activeSection === "race"){
        characterService.finalRace($scope.pickedGender, $scope.selectedRaceTitle);
        $('div.character-builder-race').animate({left : '-=4000'}, 500);
        $('div.character-builder-class').animate({right : '+=4000'}, 500);
        activeSection = "class";
        $scope.prevActive = false;
      } else if(activeSection === "class"){
        if(!$scope.characterName) {
          alert("Please enter a character name");
        } else if(!$scope.selectedClass){
          alert("Please select a class");
        } else {
          characterService.finalClass($scope.characterName, $scope.selectedClass, $scope.characterAlignment, $scope.campaign.level);
          $('div.character-builder-class').animate({left : '-=4000'}, 500);
          $('div.character-builder-stats').animate({right : '+=4000'}, 500);
          activeSection = "stats";
          $scope.showNext = false;
          $scope.showFinish = true;
        }
      }
    }

    $scope.finish = () => {
      if(activeSection === "stats"){
       if($scope.baseStatsPoints === 0){
         characterService.finalStats($scope.baseStr, $scope.baseDex, $scope.baseCon, $scope.baseInt, $scope.baseWis, $scope.baseCha, $scope.room, $scope.campaign)
       } else {
         alert("You still have points left");
       }
     }
    }

    $scope.goBack = () => {
      if(activeSection === "race"){
        $scope.prevActive = true;
      } else if(activeSection === "class"){
        $('div.character-builder-race').animate({left : '+=4000'}, 500);
        $('div.character-builder-class').animate({right : '-=4000'}, 500);
        activeSection = "race";
        $scope.showNext = true;
        $scope.showFinish = false;
      } else if(activeSection === "stats"){
        $('div.character-builder-class').animate({left : '+=4000'}, 500);
        $('div.character-builder-stats').animate({right : '-=4000'}, 500);
        activeSection = "class";
        $scope.showNext = true;
        $scope.showFinish = false;
      }
    }
}

module.exports = characterBuilderCtrl;
