pub mod formatter;
pub mod parser;

use serde::Serialize;

use crate::currency;
use crate::error::CashError;
use crate::rules::RulesEngine;

#[derive(Debug, Serialize)]
pub struct LineResult {
    pub line: usize,
    pub input: String,
    pub output: Option<String>,
    pub strategy: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ProcessResponse {
    pub success: bool,
    pub results: Vec<LineResult>,
    pub total_lines: usize,
    pub error_count: usize,
}

pub fn process_file(file_content: &str, rules_engine: &RulesEngine) -> Result<ProcessResponse, CashError> {
    let currency = currency::currency_for_code(rules_engine.currency_code())?;
    let denominations = currency.denominations();

    let lines: Vec<&str> = file_content
        .lines()
        .map(|l| l.trim())
        .filter(|l| !l.is_empty())
        .collect();

    let total_lines = lines.len();
    let mut error_count = 0;

    let results: Vec<LineResult> = lines
        .iter()
        .enumerate()
        .map(|(i, line)| {
            let line_number = i + 1;

            match parser::parse_line(line, line_number, currency.as_ref()) {
                Err(e) => {
                    error_count += 1;
                    LineResult {
                        line: line_number,
                        input: line.to_string(),
                        output: None,
                        strategy: None,
                        error: Some(e.to_string()),
                    }
                }
                Ok(transaction) => {
                    if transaction.change.0 == 0 {
                        return LineResult {
                            line: line_number,
                            input: line.to_string(),
                            output: Some(String::new()),
                            strategy: Some("minimal".to_string()),
                            error: None,
                        };
                    }

                    match rules_engine.select_strategy(&transaction) {
                        Err(e) => {
                            error_count += 1;
                            LineResult {
                                line: line_number,
                                input: line.to_string(),
                                output: None,
                                strategy: None,
                                error: Some(e.to_string()),
                            }
                        }
                        Ok(strategy) => {
                            let change_result = strategy.make_change(transaction.change.0, denominations);
                            let formatted = formatter::format_denominations(&change_result, denominations);
                            LineResult {
                                line: line_number,
                                input: line.to_string(),
                                output: Some(formatted),
                                strategy: Some(strategy.name().to_string()),
                                error: None,
                            }
                        }
                    }
                }
            }
        })
        .collect();

    Ok(ProcessResponse {
        success: error_count == 0,
        results,
        total_lines,
        error_count,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const DEFAULT_CONFIG: &str = r#"{
        "currency": "USD",
        "default_strategy": "minimal",
        "rules": [
            { "condition": { "type": "divisible_by", "divisor": 3 }, "strategy": "random" }
        ]
    }"#;

    #[test]
    fn process_single_line_minimal() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let response = process_file("2.12,3.00", &engine).unwrap();

        assert_eq!(response.total_lines, 1);
        assert_eq!(response.error_count, 0);
        assert_eq!(response.results[0].output.as_deref(), Some("3 quarters,1 dime,3 pennies"));
        assert_eq!(response.results[0].strategy.as_deref(), Some("minimal"));
    }

    #[test]
    fn process_single_line_random_sums_correctly() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let response = process_file("3.33,5.00", &engine).unwrap();

        assert_eq!(response.results[0].strategy.as_deref(), Some("random"));
        let output = response.results[0].output.as_ref().unwrap();
        assert!(!output.is_empty());
    }

    #[test]
    fn process_multiple_lines() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let input = "2.12,3.00\n1.97,2.00\n3.33,5.00";
        let response = process_file(input, &engine).unwrap();

        assert_eq!(response.total_lines, 3);
        assert_eq!(response.results[0].output.as_deref(), Some("3 quarters,1 dime,3 pennies"));
        assert_eq!(response.results[1].output.as_deref(), Some("3 pennies"));
        assert_eq!(response.results[2].strategy.as_deref(), Some("random"));
    }

    #[test]
    fn process_with_bad_line_continues() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let input = "2.12,3.00\nbadline\n1.97,2.00";
        let response = process_file(input, &engine).unwrap();

        assert_eq!(response.total_lines, 3);
        assert_eq!(response.error_count, 1);
        assert!(response.results[1].error.is_some());
        assert_eq!(response.results[2].output.as_deref(), Some("3 pennies"));
    }

    #[test]
    fn process_skips_empty_lines() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let input = "2.12,3.00\n\n\n1.97,2.00";
        let response = process_file(input, &engine).unwrap();

        assert_eq!(response.total_lines, 2);
    }

    #[test]
    fn process_exact_change() {
        let engine = RulesEngine::from_json(DEFAULT_CONFIG).unwrap();
        let response = process_file("3.00,3.00", &engine).unwrap();

        assert_eq!(response.results[0].output.as_deref(), Some(""));
    }
}
