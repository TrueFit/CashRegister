export function calculateTillTotal(drawerState) {
  return Object.entries(drawerState).reduce((total, [value, count]) => {
    return total + (parseInt(value) * count)
  }, 0)
}

export function formatTillTotal(cents, symbol = '$') {
  return `${symbol}${(cents / 100).toFixed(2)}`
}
