use crate::error::CashError;
use crate::types::{Denomination, Money};

use super::Currency;

pub struct UsdCurrency;

const USD_DENOMINATIONS: &[Denomination] = &[
    Denomination { value: 100, singular: "dollar", plural: "dollars" },
    Denomination { value: 25, singular: "quarter", plural: "quarters" },
    Denomination { value: 10, singular: "dime", plural: "dimes" },
    Denomination { value: 5, singular: "nickel", plural: "nickels" },
    Denomination { value: 1, singular: "penny", plural: "pennies" },
];

impl Currency for UsdCurrency {
    fn code(&self) -> &'static str {
        "USD"
    }

    fn denominations(&self) -> &[Denomination] {
        USD_DENOMINATIONS
    }

    fn parse_amount(&self, s: &str) -> Result<Money, CashError> {
        Money::from_str_decimal(s).ok_or_else(|| CashError::ConfigParseError(
            format!("Invalid USD amount: '{}'", s),
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn denominations_ordered_largest_first() {
        let currency = UsdCurrency;
        let denoms = currency.denominations();
        for window in denoms.windows(2) {
            assert!(window[0].value > window[1].value);
        }
    }

    #[test]
    fn smallest_denomination_is_one() {
        let currency = UsdCurrency;
        let denoms = currency.denominations();
        assert_eq!(denoms.last().unwrap().value, 1);
    }

    #[test]
    fn parse_amount_valid() {
        let currency = UsdCurrency;
        assert_eq!(currency.parse_amount("2.13").unwrap(), Money(213));
        assert_eq!(currency.parse_amount("0.01").unwrap(), Money(1));
    }

    #[test]
    fn parse_amount_invalid() {
        let currency = UsdCurrency;
        assert!(currency.parse_amount("abc").is_err());
    }
}
