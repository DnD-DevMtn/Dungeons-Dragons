function redirectCtrl($scope, $http, mainService, userService) {
    mainService.getFBUser().then((response) => {
        console.log('FB user response from mainService in redirect ctrl', response);
        userService.user = response;
        $scope.user = userService.user;
    });

    const baseUserElmUrl = 'http://swapi.co/api/';

    $scope.emulateUser1 = () => {
      $scope.user.character = rouge;
    }

    $scope.emulateUser2 = () => {
      $scope.user.character = fighter;
    }

    $scope.emulateUser3 = () => {
      $scope.user.character = sorcerer;
    }
}

const rouge = {
    "_id": 1
    , "name": "Sneaky McBackstab"
    , "race": {
      "name": "Halfing"
    }
    , "classType": {
      "name": "Rogue"
    }
    , "sprite": "ROGUE"
    , "level": 1
    , "alignment": {
        "goodEvil": "neutral"
        , "lawChaos": "chaotic"
    }
    , "descprition": {
        "sex": "female"
        , "height": 45
        , "weight": 80
        , "eyeColor": "Blue"
        , "hairColor": "White"
        , "hairStyle": "Short and Wavy"
        , "age": 23
        , "skinColor": "Pale"
    }
    , "totalLvl": 1
    , "baseStats": {
        "str": 8
        , "dex": 18
        , "con": 10
        , "int": 16
        , "wis": 15
        , "cha": 11
    }
    , "hp": 6
    , "size": "small"
    , "speed": 4
    , "saves": {
        "fort": 0
        , "ref": 2
        , "will": 0
    }
    , "armor": ["581a652cfc9a0f0b2a47a841"]
    , "weapons": ["581a47ef959c9233f0f9eaac", "5817d7626b784f1c14e36f5e", "581a5fff89e4592710b834dd"]
    , "gear": ["581a5a142709d90a714c18e5", "581a59682709d90a714c18e2"]
    , "spells": []
    , "domain": []
    , "diety": ""
    , "languages": ["Common", "Halfling"]
    , "specialAbilities": [{
        "specAbilName": ""
        , "specAbilLvl": 0
    }]
    , "money": {
        "copper": 1
        , "silver": 0
        , "gold": 100
        , "platinum": 0
    }
    , "xp": 0

}

const fighter = {
    "_id": 2
    , "name": "Big McLargehuge"
    , "race": {
      "name": "Drawf"
    }
    , "classType": {
      "name": "Fighter"
    }
    , "sprite": "FIGHTER"
    , "level": 1
    , "alignment": {
        "goodEvil": "good"
        , "lawChaos": "lawful"
    }
    , "descprition": {
        "sex": "male"
        , "height": 50
        , "weight": 180
        , "eyeColor": "Brown"
        , "hairColor": "Black"
        , "hairStyle": "Long"
        , "age": 65
        , "skinColor": "Tan"
    }
    , "totalLvl": 1
    , "baseStats": {
        "str": 18
        , "dex": 12
        , "con": 16
        , "int": 9
        , "wis": 13
        , "cha": 8
    }
    , "hp": 13
    , "size": "medium"
    , "speed": 4
    , "saves": {
        "fort": 2
        , "ref": 0
        , "will": 0
    }
    , "armor": ["581a653dfc9a0f0b2a47a842"]
    , "weapons": ["581a5e4ffddd552e2ca9f1f2"]
    , "gear": ["581a5a142709d90a714c18e5"]
    , "spells": []
    , "domain": []
    , "diety": ""
    , "languages": ["Common", "Dwarven"]
    , "specialAbilities": [{
        "specAbilName": ""
        , "specAbilLvl": 0
    }]
    , "money": {
        "copper": 0
        , "silver": 0
        , "gold": 100
        , "platinum": 0
    }
    , "xp": 0

}

const sorcerer = {
    "_id": 3
    , "name": "Idiot"
    , "race": {
      "name": "Human"
    }
    , "classType": {
      "name": "Sorcerer"
    }
    , "sprite": "SORCERER"
    , "level": 1
    , "alignment": {
        "goodEvil": "good"
        , "lawChaos": "neutral"
    }
    , "descprition": {
        "sex": "male"
        , "height": 72
        , "weight": 150
        , "eyeColor": "Green"
        , "hairColor": "Red"
        , "hairStyle": "Short"
        , "age": 27
        , "skinColor": "White"
    }
    , "totalLvl": 1
    , "baseStats": {
        "str": 10
        , "dex": 14
        , "con": 11
        , "int": 14
        , "wis": 12
        , "cha": 18
    }
    , "hp": 6
    , "size": "medium"
    , "speed": 6
    , "saves": {
        "fort": 0
        , "ref": 0
        , "will": 2
    }
    , "armor": ["581a652cfc9a0f0b2a47a841"]
    , "weapons": ["581a54c43045432ae855bb55"]
    , "gear": ["581a5a142709d90a714c18e5"]
    , "spells": []
    , "domain": []
    , "diety": ""
    , "languages": ["Common", "Elven"]
    , "specialAbilities": [{
        "specAbilName": ""
        , "specAbilLvl": 0
    }]
    , "money": {
        "copper": 0
        , "silver": 10
        , "gold": 100
        , "platinum": 0
    }
    , "xp": 0

}

// const campaign = {
//     "dm": "Test Campaign"
//     , "players": [{
//         "facebookId": ""
//         , "character": ""
//     }, {
//         "facebookId": ""
//         , "character": ""
//     }, {
//         "facebookId": ""
//         , "character": ""
//     }
//     ]
//     , "dungeons": [Dungeon]
//     , "description": {
//         "background": "this is the background"
//         , "story": "this is the story"
//         , "pictures": ""
//     }
// }

module.exports = redirectCtrl;
