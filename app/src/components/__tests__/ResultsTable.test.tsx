import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ResultsTable } from "../ResultsTable"
import type { ProcessResponse } from "../../lib/schemas"

function makeResponse(overrides: Partial<ProcessResponse> = {}): ProcessResponse {
  return {
    success: true,
    results: [
      {
        line: 1,
        input: "2.12,3.00",
        output: "3 quarters,1 dime,3 pennies",
        strategy: "minimal",
        error: null,
      },
      {
        line: 2,
        input: "3.33,5.00",
        output: "1 dollar,1 quarter,6 nickels,12 pennies",
        strategy: "random",
        error: null,
      },
    ],
    total_lines: 2,
    error_count: 0,
    ...overrides,
  }
}

describe("ResultsTable", () => {
  it("renders each result row with line number, input, and output", () => {
    render(<ResultsTable response={makeResponse()} />)

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("2.12,3.00")).toBeInTheDocument()
    expect(screen.getByText("3.33,5.00")).toBeInTheDocument()
    expect(screen.getByText("3 quarters,1 dime,3 pennies")).toBeInTheDocument()
    expect(
      screen.getByText("1 dollar,1 quarter,6 nickels,12 pennies"),
    ).toBeInTheDocument()
  })

  it("renders strategy badges", () => {
    render(<ResultsTable response={makeResponse()} />)

    expect(screen.getByText("minimal")).toBeInTheDocument()
    expect(screen.getByText("random")).toBeInTheDocument()
  })

  it("renders error text for error rows", () => {
    const response = makeResponse({
      success: false,
      results: [
        {
          line: 1,
          input: "bad line",
          output: null,
          strategy: null,
          error: "Parse error on line 1",
        },
      ],
      total_lines: 1,
      error_count: 1,
    })
    render(<ResultsTable response={response} />)

    expect(screen.getByText("Parse error on line 1")).toBeInTheDocument()
  })

  it("renders summary stats", () => {
    render(<ResultsTable response={makeResponse()} />)

    expect(screen.getByText(/2 processed/)).toBeInTheDocument()
    expect(screen.getByText(/0 errors/)).toBeInTheDocument()
  })

  it("shows error count correctly", () => {
    const response = makeResponse({
      total_lines: 5,
      error_count: 2,
    })
    render(<ResultsTable response={response} />)

    expect(screen.getByText(/5 processed/)).toBeInTheDocument()
    expect(screen.getByText(/2 errors/)).toBeInTheDocument()
  })

  it("renders empty state when no results", () => {
    const response = makeResponse({
      results: [],
      total_lines: 0,
      error_count: 0,
    })
    const { container } = render(<ResultsTable response={response} />)

    expect(container.querySelectorAll("tbody tr")).toHaveLength(0)
  })
})
