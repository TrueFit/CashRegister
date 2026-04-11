import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorBanner } from "../ErrorBanner"

describe("ErrorBanner", () => {
  it("renders message text", () => {
    render(<ErrorBanner message="Something broke" />)
    expect(screen.getByText("Something broke")).toBeInTheDocument()
  })

  it("does not render dismiss button when onDismiss is not provided", () => {
    render(<ErrorBanner message="Error" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders dismiss button when onDismiss is provided", () => {
    render(<ErrorBanner message="Error" onDismiss={() => {}} />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn()
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />)
    screen.getByRole("button").click()
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
