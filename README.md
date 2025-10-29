# Cash Register Solution

A production-ready cash register system that calculates change using optimal algorithms, supports multiple countries, and provides both CLI and REST API interfaces.

## The Problem

Creative Cash Draw Solutions needs a cash register system that:
1. Calculates change and returns optimal denominations (minimum coins/bills)
2. Uses **random denomination distribution** when owed amount is divisible by 3
3. Processes flat files with transaction data
4. Outputs formatted change strings

## Quick Start

### Using Docker (Recommended)

```bash
# Start services
docker-compose up -d

# Run database migrations
docker-compose exec app alembic upgrade head

# Process a file
docker-compose exec app python -m src.cli examples/sample_input.txt output.txt

# View results
docker-compose exec app cat output.txt
```

### Local Python

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://cashregister_user:cashregister_pass@localhost:5432/cashregister_db"

# Run migrations
alembic upgrade head

# Process file
python -m src.cli examples/sample_input.txt output.txt
```

## Sample Input/Output

**Input** ([examples/sample_input.txt](examples/sample_input.txt)):
```
2.12,3.00
1.97,2.00
3.33,5.00
```

**Output**:
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,1 quarter,6 nickels,12 pennies
```

**Explanation**:
- **Line 1**: Owed $2.12 (212¢), 212 % 3 ≠ 0 → **Greedy** → Minimum coins
- **Line 2**: Owed $1.97 (197¢), 197 % 3 ≠ 0 → **Greedy** → Minimum coins
- **Line 3**: Owed $3.33 (333¢), 333 % 3 = 0 → **Random** → Varies each run

## Architecture

Built with **Domain-Driven Design (DDD)** principles for clean separation of concerns:

```
src/
├── domain/              # Core business logic (pure, no dependencies)
│   ├── value_objects/  # Money, Denomination, Country, ChangeResult
│   ├── services/       # ChangeCalculator, DenominationService
│   └── repositories/   # Repository interfaces
├── application/        # Use cases & DTOs
│   ├── use_cases/     # ProcessChangeCalculationUseCase
│   └── dtos/          # Request/Response models
├── infrastructure/     # External concerns
│   ├── api/routes/    # FastAPI endpoints
│   ├── persistence/   # PostgreSQL repositories & models
│   └── file_processor.py
├── shared/            # Configuration
└── cli.py             # Command-line interface
```

### Why DDD?
- **Testable**: Domain logic independent of frameworks
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features without breaking existing code
- **Understandable**: Matches business terminology

## Multi-Country Support

The system uses PostgreSQL to store countries and their denominations for easy extensibility:

**Pre-loaded Countries**:
- 🇺🇸 **USA**: dollar, quarter, dime, nickel, penny
- 🇨🇦 **Canada**: toonie, loonie, quarter, dime, nickel

**Use different country**:
```bash
python -m src.cli input.txt output.txt CAN  # Use Canadian currency
```

## API Endpoints

Start the API:
```bash
docker-compose up -d
# Visit http://localhost:8000/docs for interactive documentation
```

**Calculate change for single transaction**:
```bash
curl -X POST http://localhost:8000/api/v1/change/calculate \
  -H "Content-Type: application/json" \
  -d '{"owed": 2.12, "paid": 3.00, "country_code": "USA"}'
```

**Process file via API**:
```bash
curl -X POST http://localhost:8000/api/v1/change/process-file \
  -F "file=@examples/sample_input.txt" \
  -F "country_code=USA"
```

**List countries**:
```bash
curl http://localhost:8000/api/v1/countries
```

**Get country denominations**:
```bash
curl http://localhost:8000/api/v1/countries/USA/denominations
```

## Configuration

Edit `.env` file:

```bash
# Change divisibility rule (default: 3)
CHANGE_DIVISIBILITY_RULE=5  # Use random when divisible by 5

# Default country
DEFAULT_COUNTRY_CODE=CAN  # Use Canadian currency by default

# Database connection
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/db
```

## Addressing "Things To Consider"

The original problem statement posed three considerations. Here's how this solution addresses each:

### 1. "What if client needs to change the random divisor?"

**Solution**: Environment variable configuration
```bash
CHANGE_DIVISIBILITY_RULE=5  # Change from 3 to 5
```
- No code changes needed - just update `.env` and restart
- Can differ per environment (dev, staging, prod)
- Easy A/B testing

### 2. "What if client needs to add another special case?"

**Solution**: Strategy pattern in `ChangeCalculator`

Easy to add new calculation strategies:
```python
class ChangeCalculator:
    def calculate_greedy()        # Minimum coins (existing)
    def calculate_random()         # Random distribution (existing)
    def calculate_fewest_bills()   # NEW: Minimize bills only
    def calculate_preference()     # NEW: Customer denomination preference
```

Update the use case logic to determine which strategy to use based on business rules.

### 3. "What if sales closes a new client in France?"

**Solution**: Database-driven denominations

Add new countries without code changes:

**Method 1 - Direct SQL**:
```sql
INSERT INTO countries (country_code, name, currency_code, currency_symbol)
VALUES ('FRA', 'France', 'EUR', '€');

INSERT INTO denominations (country_code, value_cents, singular_name, plural_name, denomination_type)
VALUES
    ('FRA', 200, 'two euro', 'two euros', 'TWO_EURO'),
    ('FRA', 100, 'euro', 'euros', 'EURO'),
    ('FRA', 50, 'fifty cent', 'fifty cents', 'FIFTY_CENT'),
    -- ... more denominations
```

**Method 2 - Alembic migration**:
```bash
alembic revision -m "add france"
# Edit generated file in alembic/versions/ to insert data
alembic upgrade head
```

No code deployment needed!

## Algorithms

### Greedy Algorithm (Optimal Change)
- Uses largest denominations first
- Guarantees minimum coin count for canonical coin systems
- Time complexity: O(n) where n = number of denominations
- Space complexity: O(n)

**Example**: 88¢
```
88 ÷ 25 = 3 remainder 13  → 3 quarters
13 ÷ 10 = 1 remainder 3   → 1 dime
3 ÷ 5 = 0                 → 0 nickels
3 ÷ 1 = 3 remainder 0     → 3 pennies
Result: 3 quarters, 1 dime, 3 pennies (7 coins)
```

### Random Algorithm (Divisible by 3)
**Optimized implementation** that guarantees success on first attempt:
1. Randomizes larger denominations (dollars, quarters, dimes, nickels)
2. Uses smallest denomination (pennies) greedily at end
3. No retry loops needed - mathematically guaranteed to work

**Example**: 167¢ (divisible by 3)
```
Possible outputs (varies each run):
- 1 dollar + 1 quarter + 6 nickels + 12 pennies = 167¢
- 4 quarters + 13 nickels + 2 pennies = 167¢
- 16 dimes + 1 nickel + 2 pennies = 167¢
Many valid combinations!
```

## Database Management

### View Data

```bash
# Connect to database
docker-compose exec db psql -U cashregister_user -d cashregister_db

# List all countries
SELECT * FROM countries;

# List USA denominations (sorted by value)
SELECT * FROM denominations
WHERE country_code = 'USA'
ORDER BY value_cents DESC;
```

### Add New Denomination

```sql
INSERT INTO denominations (country_code, value_cents, singular_name, plural_name, denomination_type)
VALUES ('USA', 50, 'half dollar', 'half dollars', 'HALF_DOLLAR');
```

### Deactivate Denomination

```sql
-- Stop using pennies
UPDATE denominations
SET is_active = FALSE
WHERE denomination_type = 'PENNY';
```

### Database Schema

**countries table**:
- `country_code` VARCHAR(3) PRIMARY KEY
- `name` VARCHAR(100) NOT NULL
- `currency_code` VARCHAR(3) NOT NULL
- `currency_symbol` VARCHAR(10) NOT NULL

**denominations table**:
- `id` SERIAL PRIMARY KEY
- `country_code` VARCHAR(3) FOREIGN KEY
- `value_cents` INTEGER NOT NULL
- `singular_name` VARCHAR(50) NOT NULL
- `plural_name` VARCHAR(50) NOT NULL
- `denomination_type` VARCHAR(50) NOT NULL
- `is_active` BOOLEAN DEFAULT TRUE

### Migrations

```bash
# Check current version
alembic current

# View migration history
alembic history

# Upgrade to latest
alembic upgrade head

# Downgrade one version
alembic downgrade -1

# Create new migration
alembic revision -m "description"
```

## Docker Setup

### Services

**docker-compose.yml** includes:
- **app**: FastAPI application
- **db**: PostgreSQL 16 database
- Health checks for reliability
- Volume mounting for development

### Commands

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up -d
```

### Production Configuration

For production, update [docker-compose.yml](docker-compose.yml):
```yaml
command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
environment:
  - DEBUG=False
```

## Testing

### Manual Testing

```bash
# Create test input
cat > test.txt << EOF
2.12,3.00
1.97,2.00
3.33,5.00
EOF

# Process (without Docker)
python -m src.cli test.txt output.txt

# Or with Docker
docker-compose exec app python -m src.cli test.txt output.txt

# View results
cat output.txt
```

**Expected Output**:
```
3 quarters,1 dime,3 pennies
3 pennies
<random valid combination>
```

### Verification

- Line 1: 75¢ + 10¢ + 3¢ = 88¢ ✓
- Line 2: 3¢ = 3¢ ✓
- Line 3: Total must equal 167¢ (varies each run) ✓

## Technology Stack

- **Python 3.11+** - Modern Python with type hints
- **FastAPI** - High-performance async web framework
- **PostgreSQL 16** - Reliable relational database
- **SQLAlchemy 2.0** - Async ORM with type support
- **Alembic** - Database migration tool
- **Pydantic** - Data validation and settings
- **asyncpg** - Fast PostgreSQL async driver
- **Docker & Docker Compose** - Containerization and orchestration

## Project Structure

```
.
├── README.md                # This file
├── PROBLEM.md               # Original problem statement
├── docker-compose.yml       # Service orchestration
├── Dockerfile               # Container definition
├── requirements.txt         # Python dependencies
├── alembic.ini              # Migration configuration
├── .env.example             # Environment template
│
├── src/                     # Source code
│   ├── domain/             # Business logic (pure)
│   │   ├── value_objects/  # Money, Denomination, Country, ChangeResult
│   │   ├── services/       # ChangeCalculator, DenominationService
│   │   └── repositories/   # Repository interfaces
│   ├── application/        # Use cases & DTOs
│   │   ├── use_cases/      # ProcessChangeCalculationUseCase
│   │   └── dtos/           # Request/Response models
│   ├── infrastructure/     # External concerns
│   │   ├── api/routes/     # FastAPI endpoints
│   │   ├── persistence/    # PostgreSQL repositories & models
│   │   └── file_processor.py
│   ├── shared/             # Configuration
│   │   └── config.py
│   ├── cli.py              # Command-line interface
│   └── main.py             # API entry point
│
├── alembic/                # Database migrations
│   ├── env.py             # Migration environment
│   └── versions/          # Migration files
│       ├── 001_create_countries_and_denominations.py
│       └── 002_seed_initial_data.py
│
├── examples/              # Sample files
│   ├── sample_input.txt
│   └── sample_output_example.txt
│
└── scripts/              # Utility scripts
    └── docker-entrypoint.sh  # Auto-run migrations
```

## Key Design Decisions

### 1. Domain-Driven Design
**Why**: Clean architecture, testability, maintainability
**Result**: Easy to add features without breaking existing code

### 2. Database-Driven Denominations
**Why**: Extensibility for new countries without code changes
**Result**: Add France by inserting data, no deployment needed

### 3. Strategy Pattern
**Why**: Easy to add new calculation strategies
**Result**: Add "fewest bills" or "customer preference" easily

### 4. Configuration Over Code
**Why**: Change business rules without code deployment
**Result**: Change divisor from 3 to 5 via environment variable

### 5. Async/Await
**Why**: Non-blocking database operations, better performance
**Result**: Handle concurrent API requests efficiently

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "8001:8000"
```

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Test connection
docker-compose exec db pg_isready -U cashregister_user

# View database logs
docker-compose logs db
```

### Migration Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose exec app alembic upgrade head
```

## Extension Examples

### Add New Country (Mexico)

```sql
INSERT INTO countries (country_code, name, currency_code, currency_symbol)
VALUES ('MEX', 'Mexico', 'MXN', '$');

INSERT INTO denominations (country_code, value_cents, singular_name, plural_name, denomination_type)
VALUES
    ('MEX', 1000, '10 peso', '10 pesos', 'PESO_10'),
    ('MEX', 500, '5 peso', '5 pesos', 'PESO_5'),
    ('MEX', 200, '2 peso', '2 pesos', 'PESO_2'),
    ('MEX', 100, 'peso', 'pesos', 'PESO'),
    ('MEX', 50, '50 centavo', '50 centavos', 'CENTAVO_50');
```

### Add New Calculation Strategy

In [src/domain/services/change_calculator.py](src/domain/services/change_calculator.py):
```python
def calculate_fewest_bills(self, change_amount: Money, denominations: list[Denomination]) -> dict[Denomination, int]:
    """Minimize bills, then coins."""
    bills = [d for d in denominations if d.value_cents >= 100]
    coins = [d for d in denominations if d.value_cents < 100]

    result = {}
    remaining = change_amount.cents

    # Use bills first
    for denom in sorted(bills, key=lambda x: x.value_cents, reverse=True):
        # Implementation...

    return result
```

Then update [src/application/use_cases/process_change_calculation.py](src/application/use_cases/process_change_calculation.py) to use the new strategy.


## License

MIT
