use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RulesConfig {
    pub currency: String,
    pub default_strategy: String,
    #[serde(default)]
    pub rules: Vec<Rule>,
}

#[derive(Debug, Deserialize)]
pub struct Rule {
    pub condition: Condition,
    pub strategy: String,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Condition {
    DivisibleBy { divisor: i64 },
    AmountRange {
        #[serde(default)]
        min_cents: Option<i64>,
        #[serde(default)]
        max_cents: Option<i64>,
    },
    Always,
}
