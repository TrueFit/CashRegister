const ChangeStrategy = require('./changeStrategy');

// Strategy for random change
function RandomChangeStrategy() {
  ChangeStrategy.call(this);
  
  this.calculate = function(changeInCents, denominations) {
    const result = [];
    let remaining = changeInCents;

    while (remaining > 0) {
      // Filter valid denominations
      const validDenominations = denominations.filter(function(denom) {
        return denom.value <= remaining;
      });
      
      if (validDenominations.length === 0) break;

      // Select a random denomination
      const randomIndex = Math.floor(Math.random() * validDenominations.length);
      const selectedDenomination = validDenominations[randomIndex];

      // Calculate how many we can use
      const maxCount = Math.floor(remaining / selectedDenomination.value);
      const count = Math.floor(Math.random() * maxCount) + 1;

      if (count > 0) {
        const name = count === 1 ? selectedDenomination.name : selectedDenomination.plural;
        result.push(`${count} ${name}`);
        remaining -= count * selectedDenomination.value;
      }
    }

    return result.join(',');
  };
}

module.exports = RandomChangeStrategy;
