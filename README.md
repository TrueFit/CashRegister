# Cash Register

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?

## Quick Start

### Docker (recommended)

```bash
docker compose up --build
```

Open **http://localhost:3000**.

### Local Development

**Prerequisites:** .NET 8 SDK, Node.js 20+

```bash
# Terminal 1 — API (port 5090)
cd src/CashRegister.API
dotnet run

# Terminal 2 — Frontend (port 5173, proxies API calls to 5090)
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

### Run Tests

```bash
dotnet test
```

## Project Structure

```
CashRegister/
├── src/
│   ├── CashRegister.Core/          # Business logic (no web dependencies)
│   │   ├── Models/                  # Denomination, Currency, ChangeResult, TransactionInput
│   │   ├── Strategies/              # IChangeStrategy, MinimumChangeStrategy, RandomChangeStrategy
│   │   ├── Rules/                   # IChangeRule, DivisibleByRule
│   │   ├── Services/                # ChangeService, FileParserService, CurrencyRegistry
│   │   ├── Validators/              # FluentValidation for TransactionInput
│   │   └── Configuration/           # CashRegisterSettings
│   ├── CashRegister.API/           # ASP.NET Core Web API
│   │   ├── Controllers/             # ChangeController, ConfigController
│   │   └── DTOs/                    # Request/Response records
│   └── CashRegister.Tests/         # xUnit + FluentAssertions + Moq (132 tests)
├── client/                          # React + TypeScript + Tailwind (Vite)
├── Dockerfile                       # Multi-stage build
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/change/calculate` | Upload a flat file (FormData), returns change for each line |
| `POST` | `/api/change/calculate-single` | Calculate change for a single `{ owed, paid }` transaction |
| `GET` | `/api/change/currencies` | List available currencies and their denominations |
| `GET` | `/api/config` | Get current settings (divisor, currency) |
| `PUT` | `/api/config` | Update settings at runtime |

### Example

```bash
# Single calculation
curl -X POST http://localhost:3000/api/change/calculate-single \
  -H "Content-Type: application/json" \
  -d '{"owed": 2.12, "paid": 3.00}'
```

```json
{
  "owed": 2.12,
  "paid": 3.00,
  "change": 0.88,
  "formatted": "3 quarters,1 dime,3 pennies",
  "isRandom": false,
  "breakdown": { "quarter": 3, "dime": 1, "penny": 3 }
}
```

### File Format

Each line contains `owed,paid` separated by a comma:

```
2.12,3.00
1.97,2.00
3.33,5.00
```

## Architecture

### Design Patterns

- **Strategy Pattern** — `IChangeStrategy` with `MinimumChangeStrategy` (greedy) and `RandomChangeStrategy` implementations. Adding a new algorithm requires only implementing the interface.

- **Rules Engine** — `IChangeRule` determines which strategy to use for a given transaction. `DivisibleByRule` triggers random change when the owed amount (in cents) is divisible by the configured divisor. Adding a new business rule (e.g., "if amount > $100, use only bills") requires only implementing `IChangeRule` and registering it in DI. No existing code changes.

- **Registry Pattern** — `CurrencyRegistry` holds currency definitions (USD, EUR). New currencies can be added without modifying existing code.

### Key Design Decisions

- **Integer cents everywhere** — All monetary arithmetic uses `int` cents internally to avoid floating-point precision issues. Decimal values are converted at the boundary via `Math.Round(amount * 100m, MidpointRounding.ToEven)`.

- **Runtime configuration** — Settings (divisor, currency) can be changed at runtime via the PUT endpoint. `ChangeService` uses `IOptionsMonitor<CashRegisterSettings>` to read fresh values on each request.

- **Multi-currency support** — The currency registry is pre-populated with USD and EUR. The active currency is configurable via settings, addressing the "client in France" consideration.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| API | .NET 8, ASP.NET Core |
| Business Logic | C# records, FluentValidation |
| Testing | xUnit, FluentAssertions, Moq |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Containerization | Docker multi-stage build |

### Considerations Addressed

| Consideration | Solution |
|--------------|----------|
| *What if the client changes the random divisor?* | Configurable via `appsettings.json` and runtime PUT endpoint |
| *What if there's another special case?* | Implement `IChangeRule`, register in DI. No existing code changes. |
| *What if sales closes a client in France?* | EUR currency pre-registered. Add more via `CurrencyRegistry.Register()`. |
