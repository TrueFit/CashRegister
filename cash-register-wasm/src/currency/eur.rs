use crate::error::CashError;
use crate::types::{Denomination, Money};

use super::Currency;

pub struct EurCurrency;

const EUR_DENOMINATIONS: &[Denomination] = &[
    Denomination { value: 200, singular: "2-euro coin", plural: "2-euro coins" },
    Denomination { value: 100, singular: "euro", plural: "euros" },
    Denomination { value: 50, singular: "50-cent coin", plural: "50-cent coins" },
    Denomination { value: 20, singular: "20-cent coin", plural: "20-cent coins" },
    Denomination { value: 10, singular: "10-cent coin", plural: "10-cent coins" },
    Denomination { value: 5, singular: "5-cent coin", plural: "5-cent coins" },
    Denomination { value: 2, singular: "2-cent coin", plural: "2-cent coins" },
    Denomination { value: 1, singular: "1-cent coin", plural: "1-cent coins" },
];

impl Currency for EurCurrency {
    fn code(&self) -> &'static str {
        "EUR"
    }

    fn denominations(&self) -> &[Denomination] {
        EUR_DENOMINATIONS
    }

    fn parse_amount(&self, s: &str) -> Result<Money, CashError> {
        Money::from_str_comma_decimal(s)
            .or_else(|| Money::from_str_decimal(s))
            .ok_or_else(|| CashError::ConfigParseError(
                format!("Invalid EUR amount: '{}'", s),
            ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn denominations_ordered_largest_first() {
        let currency = EurCurrency;
        let denoms = currency.denominations();
        for window in denoms.windows(2) {
            assert!(window[0].value > window[1].value);
        }
    }

    #[test]
    fn smallest_denomination_is_one() {
        let currency = EurCurrency;
        let denoms = currency.denominations();
        assert_eq!(denoms.last().unwrap().value, 1);
    }

    #[test]
    fn parse_comma_decimal() {
        let currency = EurCurrency;
        assert_eq!(currency.parse_amount("2,13").unwrap(), Money(213));
    }

    #[test]
    fn parse_dot_decimal_also_works() {
        let currency = EurCurrency;
        assert_eq!(currency.parse_amount("2.13").unwrap(), Money(213));
    }
}
