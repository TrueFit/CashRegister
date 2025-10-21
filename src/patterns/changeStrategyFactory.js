const MinimumChangeStrategy = require('../strategies/minimumChangeStrategy');
const RandomChangeStrategy = require('../strategies/randomChangeStrategy');

// Factory Pattern - Creates the appropriate strategy
function ChangeStrategyFactory() {}

ChangeStrategyFactory.createStrategy = function(changeInCents) {
  if (changeInCents % 3 === 0) {
    return new RandomChangeStrategy();
  }
  return new MinimumChangeStrategy();
};

module.exports = ChangeStrategyFactory;
