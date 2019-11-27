export const currencyFormatter = (country, ammount) => {
  return country === 'EUR'
    ? eurFormatter.format(ammount / 100)
    : usdFormatter.format(ammount / 100);
};

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const eurFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});
