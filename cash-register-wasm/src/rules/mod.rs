pub mod schema;

use crate::error::CashError;
use crate::strategy::{self, ChangeStrategy};
use crate::types::ParsedTransaction;

use schema::{Condition, RulesConfig};

pub struct RulesEngine {
    config: RulesConfig,
}

impl RulesEngine {
    pub fn from_json(json: &str) -> Result<Self, CashError> {
        let config: RulesConfig = serde_json::from_str(json)
            .map_err(|e| CashError::ConfigParseError(e.to_string()))?;

        strategy::strategy_for_name(&config.default_strategy)?;
        for rule in &config.rules {
            strategy::strategy_for_name(&rule.strategy)?;
        }

        Ok(RulesEngine { config })
    }

    pub fn currency_code(&self) -> &str {
        &self.config.currency
    }

    pub fn select_strategy(
        &self,
        transaction: &ParsedTransaction,
    ) -> Result<Box<dyn ChangeStrategy>, CashError> {
        for rule in &self.config.rules {
            if Self::matches_condition(&rule.condition, transaction) {
                return strategy::strategy_for_name(&rule.strategy);
            }
        }
        strategy::strategy_for_name(&self.config.default_strategy)
    }

    fn matches_condition(condition: &Condition, transaction: &ParsedTransaction) -> bool {
        match condition {
            Condition::DivisibleBy { divisor } => {
                *divisor != 0 && transaction.owed.0 % divisor == 0
            }
            Condition::AmountRange { min_cents, max_cents } => {
                let change = transaction.change.0;
                let above_min = min_cents.map_or(true, |min| change >= min);
                let below_max = max_cents.map_or(true, |max| change <= max);
                above_min && below_max
            }
            Condition::Always => true,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::Money;

    fn make_transaction(owed_cents: i64, paid_cents: i64) -> ParsedTransaction {
        ParsedTransaction {
            owed: Money(owed_cents),
            paid: Money(paid_cents),
            change: Money(paid_cents - owed_cents),
        }
    }

    #[test]
    fn default_strategy_when_no_rules_match() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": []
        }"#).unwrap();

        let tx = make_transaction(197, 200);
        let strategy = engine.select_strategy(&tx).unwrap();
        assert_eq!(strategy.name(), "minimal");
    }

    #[test]
    fn divisible_by_3_selects_random() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "divisible_by", "divisor": 3 }, "strategy": "random" }
            ]
        }"#).unwrap();

        let tx = make_transaction(333, 500);
        let strategy = engine.select_strategy(&tx).unwrap();
        assert_eq!(strategy.name(), "random");
    }

    #[test]
    fn not_divisible_by_3_selects_minimal() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "divisible_by", "divisor": 3 }, "strategy": "random" }
            ]
        }"#).unwrap();

        let tx = make_transaction(212, 300);
        let strategy = engine.select_strategy(&tx).unwrap();
        assert_eq!(strategy.name(), "minimal");
    }

    #[test]
    fn custom_divisor() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "divisible_by", "divisor": 5 }, "strategy": "random" }
            ]
        }"#).unwrap();

        let tx = make_transaction(500, 1000);
        let strategy = engine.select_strategy(&tx).unwrap();
        assert_eq!(strategy.name(), "random");
    }

    #[test]
    fn amount_range_condition() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "amount_range", "min_cents": 100, "max_cents": 500 }, "strategy": "random" }
            ]
        }"#).unwrap();

        let tx_in_range = make_transaction(100, 400);
        assert_eq!(engine.select_strategy(&tx_in_range).unwrap().name(), "random");

        let tx_out_of_range = make_transaction(100, 110);
        assert_eq!(engine.select_strategy(&tx_out_of_range).unwrap().name(), "minimal");
    }

    #[test]
    fn first_matching_rule_wins() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "divisible_by", "divisor": 3 }, "strategy": "random" },
                { "condition": { "type": "always" }, "strategy": "minimal" }
            ]
        }"#).unwrap();

        let tx = make_transaction(333, 500);
        assert_eq!(engine.select_strategy(&tx).unwrap().name(), "random");
    }

    #[test]
    fn invalid_strategy_in_config_fails() {
        let result = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "bogus",
            "rules": []
        }"#);
        assert!(result.is_err());
    }

    #[test]
    fn invalid_json_fails() {
        let result = RulesEngine::from_json("not json");
        assert!(result.is_err());
    }

    #[test]
    fn divisor_zero_does_not_match() {
        let engine = RulesEngine::from_json(r#"{
            "currency": "USD",
            "default_strategy": "minimal",
            "rules": [
                { "condition": { "type": "divisible_by", "divisor": 0 }, "strategy": "random" }
            ]
        }"#).unwrap();

        let tx = make_transaction(333, 500);
        assert_eq!(engine.select_strategy(&tx).unwrap().name(), "minimal");
    }
}
