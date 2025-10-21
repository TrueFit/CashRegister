// Strategy Pattern - Base strategy for change calculation
function ChangeStrategy() {
  this.calculate = function(changeInCents, denominations) {
    throw new Error('Calculate method must be implemented by subclass');
  };
}

module.exports = ChangeStrategy;
