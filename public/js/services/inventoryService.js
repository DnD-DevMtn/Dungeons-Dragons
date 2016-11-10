export default function($http) {

  this.getInventory = (weapons, gear, armor) => {
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
        })
      })
    }));

    inventoryPromises.push(new Promise((resolve, reject) => {
      getArmor(armor).then( armor => {
        resolve({
          type:"armor"
          , data: armor
        });
      })
    }));

    return Promise.all(inventoryPromises).then(results => {
      const invObj = {};
      //consider doing a reduce
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
            resolve(weapon.data);
          })
        }));
    }

    return Promise.all(weaponPromises).then(results => {
      return results;
    });

  }

  function getGear(gear) {

    const gearPromises = [];

    for(let i = 0; i < gear.length; i++) {
        gearPromises.push(new Promise((resolve, reject) => {
          $http.get(`/api/gear/${gear[i]}`)
          .then(gear => {
            resolve(gear.data);
          })
        }));
    }

    return Promise.all(gearPromises).then(results => {
      return results;
    });

  }

  function getArmor(armor) {

    const armorPromises = [];

    for(let i = 0; i < armor.length; i++) {
        armorPromises.push(new Promise((resolve, reject) => {
          $http.get(`/api/armor/${armor[i]}`)
          .then(armor => {
            resolve(armor.data);
          })
        }));
    }

    return Promise.all(armorPromises).then(results => {
      return results;
    });

  }

}
