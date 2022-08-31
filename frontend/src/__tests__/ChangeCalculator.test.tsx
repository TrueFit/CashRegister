import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChangeCalculator } from "../components/ChangeCalculator";
import * as api from "../api";
import { ChangeResponseBody } from "../../../common/interfaces";

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

const fileContents = `2.12,3.00
1.97,2.00
3.33,5.00`;

const fileName = "hello.txt";
const fakeFile = new File([fileContents], fileName, { type: "text" });

const mockResponse: ChangeResponseBody = {
  change: [
    {
      denomination: {
        name: "quarter",
        value: 25,
      },
      amount: 2,
    },
    {
      denomination: {
        name: "dime",
        value: 10,
      },
      amount: 2,
    },
    {
      denomination: {
        name: "nickel",
        value: 5,
      },
      amount: 3,
    },
    {
      denomination: {
        name: "penny",
        value: 1,
      },
      amount: 2,
    },
  ],
};

const expectedOutput =
  "2 currency.USD.quarter,2 currency.USD.dime,3 currency.USD.nickel,2 currency.USD.penny";

it("renders initial text and buttons", () => {
  render(<ChangeCalculator file={fakeFile} onReset={() => {}} />);

  expect(screen.getByText(`fileSelected ${fileName}`)).toBeTruthy();
  expect(screen.getByText("calculateChange")).toBeTruthy();
  expect(screen.getByText("selectAnotherFile")).toBeTruthy();
});

it("calls onReset when selectAnotherFile is clicked", () => {
  const mockOnReset = jest.fn(() => {});
  render(<ChangeCalculator file={fakeFile} onReset={mockOnReset} />);

  const resetButton = screen.getByText("selectAnotherFile");

  fireEvent(
    resetButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  expect(mockOnReset).toHaveBeenCalled();
});

it("makes API call when calculateChange is clicked", async () => {
  const fetchChangeSpy = jest
    .spyOn(api, "fetchChange")
    .mockResolvedValue(mockResponse);

  render(<ChangeCalculator file={fakeFile} onReset={() => {}} />);

  const calculateChangeButton = screen.getByText("calculateChange");

  fireEvent(
    calculateChangeButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(screen.getAllByText(expectedOutput)).toBeTruthy();
  });

  expect(fetchChangeSpy).toBeCalledTimes(3);
});
