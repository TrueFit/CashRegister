use cash_register_wasm::processor;
use cash_register_wasm::rules::RulesEngine;

const USD_CONFIG: &str = r#"{
    "currency": "USD",
    "default_strategy": "minimal",
    "rules": [
        { "condition": { "type": "divisible_by", "divisor": 3 }, "strategy": "random" }
    ]
}"#;

const EUR_CONFIG: &str = r#"{
    "currency": "EUR",
    "default_strategy": "minimal",
    "rules": []
}"#;

#[test]
fn readme_sample_line_1() {
    let engine = RulesEngine::from_json(USD_CONFIG).unwrap();
    let response = processor::process_file("2.12,3.00", &engine).unwrap();

    assert_eq!(response.results[0].output.as_deref(), Some("3 quarters,1 dime,3 pennies"));
    assert_eq!(response.results[0].strategy.as_deref(), Some("minimal"));
}

#[test]
fn readme_sample_line_2() {
    let engine = RulesEngine::from_json(USD_CONFIG).unwrap();
    let response = processor::process_file("1.97,2.00", &engine).unwrap();

    assert_eq!(response.results[0].output.as_deref(), Some("3 pennies"));
    assert_eq!(response.results[0].strategy.as_deref(), Some("minimal"));
}

#[test]
fn readme_sample_line_3_random_strategy_used() {
    let engine = RulesEngine::from_json(USD_CONFIG).unwrap();
    let response = processor::process_file("3.33,5.00", &engine).unwrap();

    assert_eq!(response.results[0].strategy.as_deref(), Some("random"));
    assert!(!response.results[0].output.as_ref().unwrap().is_empty());
}

#[test]
fn readme_full_sample() {
    let engine = RulesEngine::from_json(USD_CONFIG).unwrap();
    let input = "2.12,3.00\n1.97,2.00\n3.33,5.00";
    let response = processor::process_file(input, &engine).unwrap();

    assert_eq!(response.total_lines, 3);
    assert!(response.results[0].error.is_none());
    assert!(response.results[1].error.is_none());
    assert!(response.results[2].error.is_none());
}

#[test]
fn eur_currency_denominations() {
    let engine = RulesEngine::from_json(EUR_CONFIG).unwrap();
    let response = processor::process_file("1.50,2.00", &engine).unwrap();

    let output = response.results[0].output.as_ref().unwrap();
    assert_eq!(output, "1 50-cent coin");
}

#[test]
fn eur_multiple_denominations() {
    let engine = RulesEngine::from_json(EUR_CONFIG).unwrap();
    let response = processor::process_file("0.27,1.00", &engine).unwrap();

    let output = response.results[0].output.as_ref().unwrap();
    assert_eq!(output, "1 50-cent coin,1 20-cent coin,1 2-cent coin,1 1-cent coin");
}

#[test]
fn malformed_input_per_line_error() {
    let engine = RulesEngine::from_json(USD_CONFIG).unwrap();
    let input = "2.12,3.00\nnot_valid\n1.97,2.00";
    let response = processor::process_file(input, &engine).unwrap();

    assert_eq!(response.total_lines, 3);
    assert_eq!(response.error_count, 1);
    assert!(response.results[0].error.is_none());
    assert!(response.results[1].error.is_some());
    assert!(response.results[2].error.is_none());
}
