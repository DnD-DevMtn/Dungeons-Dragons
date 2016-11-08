export default function($http) {
  this.getInventory = (weapons, gear, armor) => {
    const inventory = {};
    const inventoryPromises = [];
    inventoryPromises.push(new Promise((resolve, reject) => {
        getWeapons(weapons).then(weapons => {
        resolve({
          type:"weapons"
          , data: weapons
        });
      })
    }));
    inventoryPromises.push(new Promise((resolve, reject) => {
        getGear(gear).then(gear => {
        resolve({
          type:"gear"
          , data: gear
        });
      })
    }));
    inventoryPromises.push(new Promise((resolve, reject) => {
      getArmor(armor).then(armor => {
        resolve({
          type:"armor"
          , data: armor
        });
      })
    }));
    return Promise.all(inventoryPromises).then(results => {
      console.log(results);
      const invObj = {};
      results.forEach(entry => {
        invObj[entry.type] = entry.data;
      })
      return invObj;
    })
  }

  function getWeapons(weapons) {
    const weaponPromises = [];
    for(let i = 0; i < weapons.length; i++) {
        weaponPromises.push(new Promise((resolve, reject) => {
          $http.get(`/api/weapons/${weapons[i]}`)
          .then(weapon => {
            console.log(weapon);
            resolve(weapon.data);
          })
        }));
    }
    return Promise.all(weaponPromises).then(results => {
      console.log(results)
      return results;
    });
  }

  function getGear(gear) {
    const gearPromises = [];
    for(let i = 0; i < gear.length; i++) {
        gearPromises.push(new Promise((resolve, reject) => {
          $http.get(`/api/gear/${gear[i]}`)
          .then(gear => {
            console.log(gear);
            resolve(gear.data);
          })
        }));
    }
    return Promise.all(gearPromises).then(results => {
      console.log(results);
      return results;
    });
  }

  function getArmor(armor) {
    const armorPromises = [];
    for(let i = 0; i < armor.length; i++) {
        armorPromises.push(new Promise((resolve, reject) => {
          $http.get(`/api/armor/${armor[i]}`)
          .then(armor => {
            console.log(armor);
            resolve(armor.data);
          })
        }));
    }
    return Promise.all(armorPromises).then(results => {
      console.log(results);
      return results;
    });
  }
}
