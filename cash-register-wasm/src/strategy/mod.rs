pub mod minimal;
pub mod random;

use crate::error::CashError;
use crate::types::Denomination;

pub trait ChangeStrategy: Send + Sync {
    fn name(&self) -> &'static str;
    fn make_change(&self, change_cents: i64, denominations: &[Denomination]) -> Vec<(usize, u32)>;
}

pub fn strategy_for_name(name: &str) -> Result<Box<dyn ChangeStrategy>, CashError> {
    match name {
        "minimal" => Ok(Box::new(minimal::MinimalChange)),
        "random" => Ok(Box::new(random::RandomChange)),
        other => Err(CashError::UnknownStrategy(other.to_string())),
    }
}

pub fn supported_strategies() -> &'static [&'static str] {
    &["minimal", "random"]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn registry_minimal() {
        let strategy = strategy_for_name("minimal").unwrap();
        assert_eq!(strategy.name(), "minimal");
    }

    #[test]
    fn registry_random() {
        let strategy = strategy_for_name("random").unwrap();
        assert_eq!(strategy.name(), "random");
    }

    #[test]
    fn registry_unknown() {
        assert!(strategy_for_name("greedy").is_err());
    }
}
