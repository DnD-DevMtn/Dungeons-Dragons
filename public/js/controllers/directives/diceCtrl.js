export default function() {
  const dice = this;

  dice.result;

  dice.roll3 = () => {
    dice.result = getRandomInt(1,3)
  }
  dice.roll4 = () => {
    dice.result = getRandomInt(1,4)
  }
  dice.roll6 = () => {
    dice.result = getRandomInt(1,6)
  }
  dice.roll8 = () => {
    dice.result = getRandomInt(1,8)
  }
  dice.roll10 = () => {
    dice.result = getRandomInt(1,10)
  }
  dice.roll12 = () => {
    dice.result = getRandomInt(1,12)
  }
  dice.roll20 = () => {
    dice.result = getRandomInt(1,20)
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
