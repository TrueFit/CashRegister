module.exports = {
  // For additional denominations, add here
  denominations: {
    100: 'dollar',
    25: 'quarter',
    10: 'dime',
    5: 'nickel',
    1: 'penny'
  },
  // For more complex pluralization, use a pluralization npm package
  pluralize: function(num, str) {
    if (num < 2) { return str; }
    if (str.slice(-1) === 'y') {
      return str.slice(0, -1) + 'ies';
    }
    return str + 's';
  }
};
