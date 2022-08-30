import { calculateChange } from "../change";
import { getCurrencyDenominations } from "../currency";
import { ChangeResponseBody, Denomination } from "../interfaces";
import * as request from "supertest";
import { app, server } from "../app";

const mockDenominations: Denomination[] = [
  { name: "oneDollar", value: 100 },
  { name: "twentyFiveCents", value: 25 },
  { name: "tenCents", value: 10 },
  { name: "fiveCents", value: 5 },
  { name: "oneCent", value: 1 },
];

describe("calculateChange", () => {
  it("should return correct minimal change when amount owed is not divisible by three", () => {
    const amountOwed = 2.12;
    const amountPaid = 3.0;

    const change = calculateChange(amountPaid, amountOwed, mockDenominations);

    expect(change.length).toEqual(3);

    expect(change[0].denomination.name).toEqual("twentyFiveCents");
    expect(change[0].denomination.value).toEqual(25);
    expect(change[0].amount).toEqual(3);

    expect(change[1].denomination.name).toEqual("tenCents");
    expect(change[1].denomination.value).toEqual(10);
    expect(change[1].amount).toEqual(1);

    expect(change[2].denomination.name).toEqual("oneCent");
    expect(change[2].denomination.value).toEqual(1);
    expect(change[2].amount).toEqual(3);
  });

  it("should return random change with correct total value when amount owed is divisible by three", () => {
    const amountOwed = 3.33;
    const amountPaid = 5.0;
    const expectedTotalChange = (amountPaid - amountOwed) * 100;

    const change = calculateChange(amountPaid, amountOwed, mockDenominations);

    const actualTotalChange = change
      .map(
        (changePortion) =>
          changePortion.amount * changePortion.denomination.value
      )
      .reduce((previousTotal, currentTotal) => previousTotal + currentTotal, 0);

    expect(actualTotalChange).toEqual(expectedTotalChange);
  });

  it("should return random change in correct order when amount owed is divisible by three", () => {
    const amountOwed = 12.12;
    const amountPaid = 15.0;

    const change = calculateChange(amountPaid, amountOwed, mockDenominations);

    for (let i = 1; i < change.length; i++) {
      expect(change[i].denomination.value < change[i - 1].denomination.value);
    }
  });
});

describe("getCurrencyDenominations", () => {
  it("should return correct number of US denominations", () => {
    const currencyDenominations = getCurrencyDenominations("USD");

    expect(currencyDenominations).not.toBeNull();
    expect(currencyDenominations!.length).toEqual(5);
  });

  it("should return null for unsupported currency", () => {
    const currencyDenominations = getCurrencyDenominations("SchuteBucks");

    expect(currencyDenominations).toBeNull();
  });
});

describe("GET /change", () => {
  it("returns correct change when URL query params are correct", async () => {
    const result = await request
      .agent(app)
      .get("/change?owed=1.97&paid=2.00&currency=USD");
    expect(result.statusCode).toEqual(200);

    const resultBody = result.body as ChangeResponseBody;
    expect(resultBody).not.toBeNull();
    expect(resultBody.change).not.toBeNull();
    expect(resultBody.change.length).toEqual(1);
    expect(resultBody.change[0].amount).toEqual(3);
    expect(resultBody.change[0].denomination.name).toEqual("penny");
    expect(resultBody.change[0].denomination.value).toEqual(1);
  });

  it("returns 404 when currency is not found", async () => {
    const result = await request
      .agent(app)
      .get("/change?owed=2.13&paid=3.00&currency=StanleyNickels");
    expect(result.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await server.close();
});
