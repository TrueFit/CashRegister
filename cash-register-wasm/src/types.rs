use serde::Serialize;
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize)]
pub struct Money(pub i64);

impl Money {
    pub fn from_str_decimal(s: &str) -> Option<Money> {
        let trimmed = s.trim();
        let parts: Vec<&str> = trimmed.split('.').collect();
        match parts.len() {
            1 => {
                let dollars = parts[0].parse::<i64>().ok()?;
                Some(Money(dollars * 100))
            }
            2 => {
                let dollars = parts[0].parse::<i64>().ok()?;
                let cent_str = parts[1];
                if cent_str.len() > 2 {
                    return None;
                }
                let cents = if cent_str.len() == 1 {
                    cent_str.parse::<i64>().ok()? * 10
                } else {
                    cent_str.parse::<i64>().ok()?
                };
                Some(Money(dollars * 100 + cents))
            }
            _ => None,
        }
    }

    pub fn from_str_comma_decimal(s: &str) -> Option<Money> {
        let replaced = s.trim().replace(',', ".");
        Money::from_str_decimal(&replaced)
    }
}

impl fmt::Display for Money {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}.{:02}", self.0 / 100, self.0 % 100)
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Denomination {
    pub value: i64,
    pub singular: &'static str,
    pub plural: &'static str,
}

#[derive(Debug, Clone)]
pub struct ParsedTransaction {
    pub owed: Money,
    pub paid: Money,
    pub change: Money,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_decimal_standard() {
        assert_eq!(Money::from_str_decimal("2.13"), Some(Money(213)));
        assert_eq!(Money::from_str_decimal("3.00"), Some(Money(300)));
        assert_eq!(Money::from_str_decimal("0.01"), Some(Money(1)));
        assert_eq!(Money::from_str_decimal("100"), Some(Money(10000)));
    }

    #[test]
    fn parse_decimal_single_digit_cents() {
        assert_eq!(Money::from_str_decimal("1.5"), Some(Money(150)));
    }

    #[test]
    fn parse_decimal_invalid() {
        assert_eq!(Money::from_str_decimal("abc"), None);
        assert_eq!(Money::from_str_decimal("1.234"), None);
        assert_eq!(Money::from_str_decimal(""), None);
    }

    #[test]
    fn parse_decimal_whitespace() {
        assert_eq!(Money::from_str_decimal("  2.13  "), Some(Money(213)));
    }

    #[test]
    fn parse_comma_decimal() {
        assert_eq!(Money::from_str_comma_decimal("2,13"), Some(Money(213)));
        assert_eq!(Money::from_str_comma_decimal("3,00"), Some(Money(300)));
    }
}
