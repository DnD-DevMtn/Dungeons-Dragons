function characterBuilderCtrl($scope, characterService, sockets) {
    $scope.test = "testing ayayyayayayaya";
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

    $scope.finalRace = () => {
      characterService.finalRace($scope.pickedGender, $scope.selectedRaceTitle);
      $()
    }
}

module.exports = characterBuilderCtrl;
