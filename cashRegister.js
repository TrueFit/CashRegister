const _ = require('lodash');
const fs = require('fs');

const { denominations, pluralize } = require('./currency');

function convertToCents(str) {
  return Number(str) * 100;
}

function countForDenominationRandom(val, denom) {
  if (denom === 1) { return val; }
  return _.random(0, countForDenominationGreedy(val, denom));
}

function countForDenominationGreedy(val, denom) {
  return Math.floor(val / denom);
}

function generateChangeObj (val, countFunction) {
  const denomValues = _(denominations)
    .keys()
    .map(Number)
    .orderBy()
    .reverse()
    .value();

  return denomValues.reduce((coinCountObj, denom) => {
    const currentDenomCount = countFunction(val, denom);
    val -= (currentDenomCount * denom);
    return { [denom]: currentDenomCount, ...coinCountObj };
  }, {});
}

function formatChange(changeObj) {
  const denomValues = _(denominations).keys().map(Number).orderBy().reverse().value();
  return denomValues
    .map(denom => {
      const num = changeObj[denom];
      let label = pluralize(num, denominations[denom]);
      if (num < 1) { return ''; }
      return `${num} ${label}`;
    })
    .filter(part => !!part)
    .join(',')
}


function cashRegister(owedStr, paidStr) {
  // Calculating math in cents to avoid floating point arithmetic
  const owedCents = convertToCents(owedStr);
  const paidCents = convertToCents(paidStr);
  const changeValue = paidCents - owedCents;
  const selectRandomly = owedCents % 3 === 0;
  const countFunction = selectRandomly
    ? countForDenominationRandom
    : countForDenominationGreedy;

  const changeObj = generateChangeObj(changeValue, countFunction)
  return formatChange(changeObj);
}

module.exports = cashRegister;
