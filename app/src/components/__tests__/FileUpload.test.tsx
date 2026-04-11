import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FileUpload } from "../FileUpload"

describe("FileUpload", () => {
  it("renders drop zone with default text", () => {
    render(<FileUpload onFileLoaded={() => {}} />)
    expect(screen.getByText(/Drop file here/i)).toBeInTheDocument()
    expect(screen.getByText(/click to browse/i)).toBeInTheDocument()
  })

  it("calls onFileLoaded with file content when file is selected", async () => {
    const onFileLoaded = vi.fn()
    const { container } = render(<FileUpload onFileLoaded={onFileLoaded} />)

    const fileContent = "2.12,3.00\n1.97,2.00"
    const file = new File([fileContent], "transactions.csv", { type: "text/csv" })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    // Manually dispatch a change event with the file
    Object.defineProperty(input, "files", { value: [file], configurable: true })
    input.dispatchEvent(new Event("change", { bubbles: true }))

    // FileReader is async, wait for it
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(onFileLoaded).toHaveBeenCalledWith(fileContent, "transactions.csv")
  })

  it("shows the file name after a file is loaded", async () => {
    const { container } = render(<FileUpload onFileLoaded={() => {}} />)

    const file = new File(["content"], "my-file.txt", { type: "text/plain" })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(input, "files", { value: [file], configurable: true })
    input.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(screen.getByText("my-file.txt")).toBeInTheDocument()
  })
})
