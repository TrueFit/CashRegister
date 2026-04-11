import type { Condition, Rule, RulesConfig } from "../lib/schemas"

type RulesBuilderProps = {
  config: RulesConfig
  supportedCurrencies: string[]
  supportedStrategies: string[]
  onChange: (config: RulesConfig) => void
}

const CONDITION_TYPES = [
  { value: "divisible_by", label: "divisible by" },
  { value: "amount_range", label: "in range" },
  { value: "always", label: "always" },
] as const

const STRATEGY_LABELS: Record<string, string> = {
  minimal: "Minimal change",
  random: "Random denominations",
}

function strategyLabel(name: string): string {
  return STRATEGY_LABELS[name] ?? name
}

export function RulesBuilder({
  config,
  supportedCurrencies,
  supportedStrategies,
  onChange,
}: RulesBuilderProps) {
  const updateCurrency = (currency: string) => {
    onChange({ ...config, currency })
  }

  const updateDefaultStrategy = (default_strategy: string) => {
    onChange({ ...config, default_strategy })
  }

  const updateRule = (index: number, rule: Rule) => {
    const rules = config.rules.map((r, i) => (i === index ? rule : r))
    onChange({ ...config, rules })
  }

  const removeRule = (index: number) => {
    const rules = config.rules.filter((_, i) => i !== index)
    onChange({ ...config, rules })
  }

  const addRule = () => {
    const newRule: Rule = {
      condition: { type: "divisible_by", divisor: 3 },
      strategy: "random",
    }
    onChange({ ...config, rules: [...config.rules, newRule] })
  }

  const updateConditionType = (index: number, conditionType: Condition["type"]) => {
    const rule = config.rules[index]
    const condition: Condition =
      conditionType === "divisible_by"
        ? { type: "divisible_by", divisor: 3 }
        : conditionType === "amount_range"
          ? { type: "amount_range" }
          : { type: "always" }
    updateRule(index, { ...rule, condition })
  }

  return (
    <div className="config-controls">
      <div className="config-field">
        <label htmlFor="currency-select" className="config-field-label">
          Currency
        </label>
        <select
          id="currency-select"
          className="select-control-full"
          value={config.currency}
          onChange={(e) => updateCurrency(e.target.value)}
        >
          {supportedCurrencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="config-field">
        <label htmlFor="default-strategy-select" className="config-field-label">
          Default Strategy
        </label>
        <select
          id="default-strategy-select"
          className="select-control-full"
          value={config.default_strategy}
          onChange={(e) => updateDefaultStrategy(e.target.value)}
        >
          {supportedStrategies.map((s) => (
            <option key={s} value={s}>
              {strategyLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="section-label" style={{ marginTop: 4 }}>
          Rules
        </div>
        <div className="rules-list">
          {config.rules.map((rule, i) => (
            <div key={i} className="rule-card">
              <div className="rule-card-header">
                <span className="rule-card-title">Rule {i + 1}</span>
                <button className="rule-card-remove" onClick={() => removeRule(i)}>
                  &times;
                </button>
              </div>
              <div className="rule-row">
                <span className="rule-text">When owed is</span>
                <select
                  className="select-control select-sm"
                  value={rule.condition.type}
                  onChange={(e) =>
                    updateConditionType(i, e.target.value as Condition["type"])
                  }
                >
                  {CONDITION_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>
                {rule.condition.type === "divisible_by" ? (
                  <input
                    type="number"
                    className="number-input"
                    value={rule.condition.divisor}
                    min={1}
                    onChange={(e) => {
                      const divisor = parseInt(e.target.value, 10)
                      if (!isNaN(divisor) && divisor > 0) {
                        updateRule(i, {
                          ...rule,
                          condition: { type: "divisible_by", divisor },
                        })
                      }
                    }}
                  />
                ) : null}
              </div>
              <div className="rule-row">
                <span className="rule-text">then use</span>
                <select
                  className="select-control select-sm"
                  value={rule.strategy}
                  onChange={(e) => updateRule(i, { ...rule, strategy: e.target.value })}
                >
                  {supportedStrategies.map((s) => (
                    <option key={s} value={s}>
                      {strategyLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button className="btn-add-rule" onClick={addRule}>
            + Add Rule
          </button>
        </div>
      </div>
    </div>
  )
}
