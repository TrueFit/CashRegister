/**
 * Formats a list of denomination counts into properly pluralized, comma-separated text in descending order.
 * E.g.: "1 dollar, 1 quarter, 1 nickel, 3 pennies"
 * 
 * @param {Array<{ name: string, plural: string, count: number, value: number }>} denominationResults 
 * @param {string} [zeroChangeMessage="0 pennies"]
 * @returns {string}
 */
function formatChange(denominationResults, zeroChangeMessage = '0 pennies') {
  if (!denominationResults || denominationResults.length === 0) {
    return zeroChangeMessage;
  }

  // Filter only denominations that have a positive count
  const positive = denominationResults.filter(item => item.count > 0);

  if (positive.length === 0) {
    return zeroChangeMessage;
  }

  // Ensure descending order by denomination value
  positive.sort((a, b) => b.value - a.value);

  const formattedParts = positive.map(item => {
    const label = item.count === 1 ? item.name : item.plural;
    return `${item.count} ${label}`;
  });

  return formattedParts.join(', ');
}

module.exports = {
  formatChange
};
