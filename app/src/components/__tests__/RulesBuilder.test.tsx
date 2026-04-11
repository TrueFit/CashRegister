import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { RulesBuilder } from "../RulesBuilder"
import type { RulesConfig } from "../../lib/schemas"

const defaultConfig: RulesConfig = {
  currency: "USD",
  default_strategy: "minimal",
  rules: [
    { condition: { type: "divisible_by", divisor: 3 }, strategy: "random" },
  ],
}

const CURRENCIES = ["USD", "EUR"]
const STRATEGIES = ["minimal", "random"]

describe("RulesBuilder", () => {
  it("renders currency dropdown with all supported currencies", () => {
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={() => {}}
      />,
    )

    const currencySelect = screen.getByLabelText(/Currency/i) as HTMLSelectElement
    expect(currencySelect.value).toBe("USD")
    expect(screen.getByRole("option", { name: "USD" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "EUR" })).toBeInTheDocument()
  })

  it("renders default strategy dropdown with label options", () => {
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={() => {}}
      />,
    )

    expect(screen.getByLabelText(/Default Strategy/i)).toBeInTheDocument()
    expect(
      screen.getAllByRole("option", { name: /Minimal change/i }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole("option", { name: /Random denominations/i }).length,
    ).toBeGreaterThan(0)
  })

  it("renders existing rules", () => {
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={() => {}}
      />,
    )

    expect(screen.getByText(/Rule 1/)).toBeInTheDocument()
    expect(screen.getByText(/When owed is/)).toBeInTheDocument()
    expect(screen.getByDisplayValue("3")).toBeInTheDocument()
  })

  it("calls onChange when currency changes", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    const currencySelect = screen.getByLabelText(/Currency/i)
    fireEvent.change(currencySelect, { target: { value: "EUR" } })

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ currency: "EUR" }),
    )
  })

  it("adds a new rule when Add Rule is clicked", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /Add Rule/i }))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rules: expect.arrayContaining([
          expect.anything(),
          expect.objectContaining({
            condition: expect.objectContaining({ type: "divisible_by" }),
          }),
        ]),
      }),
    )
    const lastCall = onChange.mock.calls[0][0]
    expect(lastCall.rules).toHaveLength(2)
  })

  it("removes a rule when remove button is clicked", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    const removeButton = screen.getByRole("button", { name: "×" })
    fireEvent.click(removeButton)

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ rules: [] }),
    )
  })

  it("updates divisor when number input changes", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    const divisorInput = screen.getByDisplayValue("3")
    fireEvent.change(divisorInput, { target: { value: "5" } })

    const lastCall = onChange.mock.calls[0][0]
    expect(lastCall.rules[0].condition).toEqual({
      type: "divisible_by",
      divisor: 5,
    })
  })

  it("ignores invalid divisor values", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    const divisorInput = screen.getByDisplayValue("3")
    fireEvent.change(divisorInput, { target: { value: "0" } })
    fireEvent.change(divisorInput, { target: { value: "abc" } })

    expect(onChange).not.toHaveBeenCalled()
  })

  it("changes condition type when dropdown changes", () => {
    const onChange = vi.fn()
    render(
      <RulesBuilder
        config={defaultConfig}
        supportedCurrencies={CURRENCIES}
        supportedStrategies={STRATEGIES}
        onChange={onChange}
      />,
    )

    const conditionSelect = screen.getByDisplayValue("divisible by")
    fireEvent.change(conditionSelect, { target: { value: "always" } })

    const lastCall = onChange.mock.calls[0][0]
    expect(lastCall.rules[0].condition).toEqual({ type: "always" })
  })
})
