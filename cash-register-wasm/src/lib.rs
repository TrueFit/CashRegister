pub mod currency;
pub mod error;
pub mod processor;
pub mod rules;
pub mod strategy;
pub mod types;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_transactions(file_content: &str, rules_config_json: &str) -> Result<JsValue, JsValue> {
    let engine = rules::RulesEngine::from_json(rules_config_json)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let response = processor::process_file(file_content, &engine)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    serde_json::to_string(&response)
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn validate_config(rules_config_json: &str) -> Result<(), JsValue> {
    rules::RulesEngine::from_json(rules_config_json)
        .map(|_| ())
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn list_supported_currencies() -> JsValue {
    let currencies = currency::supported_currencies();
    JsValue::from_str(&serde_json::to_string(currencies).unwrap())
}

#[wasm_bindgen]
pub fn list_supported_strategies() -> JsValue {
    let strategies = strategy::supported_strategies();
    JsValue::from_str(&serde_json::to_string(strategies).unwrap())
}
