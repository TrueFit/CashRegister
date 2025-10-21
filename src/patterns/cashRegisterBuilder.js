const { DENOMINATIONS, DenominationsFactory } = require('../core/denominations');

// Builder Pattern - To configure the CashRegister
function CashRegisterBuilder() {
  this.denominations = DENOMINATIONS.slice(); // Create copy
  this.countryCode = null;
}

CashRegisterBuilder.prototype.addDenomination = function(name, value, plural) {
  this.denominations.push({ name: name, value: value, plural: plural });
  return this;
};

CashRegisterBuilder.prototype.removeDenomination = function(name) {
  this.denominations = this.denominations.filter(function(denom) {
    return denom.name !== name;
  });
  return this;
};

CashRegisterBuilder.prototype.setCountry = function(countryCode) {
  this.countryCode = countryCode;
  if (countryCode) {
    const countryConfig = DenominationsFactory.getDenominations(countryCode);
    this.denominations = countryConfig.denominations.slice();
  }
  return this;
};

CashRegisterBuilder.prototype.build = function() {
  const CashRegister = require('../core/cashRegister');
  return new CashRegister(this.denominations, this.countryCode);
};

module.exports = CashRegisterBuilder;
