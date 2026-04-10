use crate::currency::Currency;
use crate::error::CashError;
use crate::types::{Money, ParsedTransaction};

pub fn parse_line(
    line: &str,
    line_number: usize,
    currency: &dyn Currency,
) -> Result<ParsedTransaction, CashError> {
    let parts: Vec<&str> = line.split(',').collect();
    if parts.len() != 2 {
        return Err(CashError::ParseError {
            line: line_number,
            message: format!("Expected 'owed,paid' but got '{}'", line),
        });
    }

    let owed = currency.parse_amount(parts[0]).map_err(|_| CashError::ParseError {
        line: line_number,
        message: format!("Invalid owed amount: '{}'", parts[0].trim()),
    })?;

    let paid = currency.parse_amount(parts[1]).map_err(|_| CashError::ParseError {
        line: line_number,
        message: format!("Invalid paid amount: '{}'", parts[1].trim()),
    })?;

    if paid.0 < owed.0 {
        return Err(CashError::InsufficientPayment { line: line_number });
    }

    Ok(ParsedTransaction {
        owed,
        paid,
        change: Money(paid.0 - owed.0),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::currency::usd::UsdCurrency;

    #[test]
    fn parse_valid_line() {
        let currency = UsdCurrency;
        let tx = parse_line("2.12,3.00", 1, &currency).unwrap();
        assert_eq!(tx.owed, Money(212));
        assert_eq!(tx.paid, Money(300));
        assert_eq!(tx.change, Money(88));
    }

    #[test]
    fn parse_line_with_whitespace() {
        let currency = UsdCurrency;
        let tx = parse_line(" 2.12 , 3.00 ", 1, &currency).unwrap();
        assert_eq!(tx.change, Money(88));
    }

    #[test]
    fn parse_line_missing_comma() {
        let currency = UsdCurrency;
        assert!(parse_line("2.12 3.00", 1, &currency).is_err());
    }

    #[test]
    fn parse_line_insufficient_payment() {
        let currency = UsdCurrency;
        assert!(parse_line("5.00,3.00", 1, &currency).is_err());
    }

    #[test]
    fn parse_line_exact_payment() {
        let currency = UsdCurrency;
        let tx = parse_line("3.00,3.00", 1, &currency).unwrap();
        assert_eq!(tx.change, Money(0));
    }

    #[test]
    fn parse_line_invalid_amount() {
        let currency = UsdCurrency;
        assert!(parse_line("abc,3.00", 1, &currency).is_err());
    }
}
