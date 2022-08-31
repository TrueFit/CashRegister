import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileSelector } from "../components/FileSelector";

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

it("renders initial text and button", () => {
  render(<FileSelector onFileSelect={() => {}} />);

  expect(screen.getByText(/selectAFile/i)).toBeTruthy();
  expect(screen.getByText(/dragAndDropYourFileHere/i)).toBeTruthy();
  expect(screen.getByText(/browseFiles/i)).toBeTruthy();
});

it("triggers onFileSelect when selecting a file", () => {
  const mockOnFileSelect = jest.fn(() => {});

  render(<FileSelector onFileSelect={mockOnFileSelect} />);

  const fakeFile = new File(["hello"], "hello.txt", { type: "text" });
  const browseFilesButton = screen.getByText(/browseFiles/i);

  userEvent.upload(browseFilesButton, fakeFile);

  expect(mockOnFileSelect).toHaveBeenCalled();
});
