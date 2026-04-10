pub mod eur;
pub mod usd;

use crate::error::CashError;
use crate::types::{Denomination, Money};

pub trait Currency: Send + Sync {
    fn code(&self) -> &'static str;
    fn denominations(&self) -> &[Denomination];
    fn parse_amount(&self, s: &str) -> Result<Money, CashError>;
}

pub fn currency_for_code(code: &str) -> Result<Box<dyn Currency>, CashError> {
    match code {
        "USD" => Ok(Box::new(usd::UsdCurrency)),
        "EUR" => Ok(Box::new(eur::EurCurrency)),
        other => Err(CashError::UnknownCurrency(other.to_string())),
    }
}

pub fn supported_currencies() -> &'static [&'static str] {
    &["USD", "EUR"]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn registry_usd() {
        let currency = currency_for_code("USD").unwrap();
        assert_eq!(currency.code(), "USD");
    }

    #[test]
    fn registry_eur() {
        let currency = currency_for_code("EUR").unwrap();
        assert_eq!(currency.code(), "EUR");
    }

    #[test]
    fn registry_unknown() {
        assert!(currency_for_code("GBP").is_err());
    }
}
