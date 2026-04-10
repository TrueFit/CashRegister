use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
pub enum CashError {
    #[error("Unknown currency: {0}")]
    UnknownCurrency(String),

    #[error("Unknown strategy: {0}")]
    UnknownStrategy(String),

    #[error("Invalid config: {0}")]
    ConfigParseError(String),

    #[error("Line {line}: {message}")]
    ParseError { line: usize, message: String },

    #[error("Line {line}: paid amount less than owed")]
    InsufficientPayment { line: usize },
}
