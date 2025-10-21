const ChangeStrategy = require('./changeStrategy');

// Strategy for minimum change (greedy algorithm)
function MinimumChangeStrategy() {
  ChangeStrategy.call(this);
  
  this.calculate = function(changeInCents, denominations) {
    const result = [];
    let remaining = changeInCents;

    for (const denomination of denominations) {
      const count = Math.floor(remaining / denomination.value);
      if (count > 0) {
        const name = count === 1 ? denomination.name : denomination.plural;
        result.push(`${count} ${name}`);
        remaining -= count * denomination.value;
      }
    }

    return result.join(',');
  };
}

module.exports = MinimumChangeStrategy;
