import asyncio
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.persistence.database import AsyncSessionLocal
from src.infrastructure.persistence.repositories.denomination_repository_impl import PostgresDenominationRepository
from src.domain.services.change_calculator import ChangeCalculator
from src.application.use_cases.process_change_calculation import ProcessChangeCalculationUseCase
from src.shared.config import settings


async def process_change_file(input_file: str, output_file: str, country_code: str = "USA"):
    async with AsyncSessionLocal() as session:
        denomination_repo = PostgresDenominationRepository(session)
        change_calculator = ChangeCalculator()

        use_case = ProcessChangeCalculationUseCase(
            denomination_repository=denomination_repo,
            change_calculator=change_calculator,
            divisibility_rule=settings.CHANGE_DIVISIBILITY_RULE
        )

        try:
            await use_case.execute_from_file(input_file, output_file, country_code)
            print(f"✓ Successfully processed {input_file}")
            print(f"✓ Output written to {output_file}")
        except Exception as e:
            print(f"✗ Error processing file: {e}", file=sys.stderr)
            sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print("Usage: python -m src.cli <input_file> <output_file> [country_code]")
        print("\nExample:")
        print("  python -m src.cli input.txt output.txt")
        print("  python -m src.cli input.txt output.txt CAN")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    country_code = sys.argv[3] if len(sys.argv) > 3 else "USA"

    if not Path(input_file).exists():
        print(f"✗ Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)

    print(f"Processing change calculations...")
    print(f"  Input: {input_file}")
    print(f"  Output: {output_file}")
    print(f"  Country: {country_code}")
    print(f"  Divisibility rule: {settings.CHANGE_DIVISIBILITY_RULE}")
    print()

    asyncio.run(process_change_file(input_file, output_file, country_code))


if __name__ == "__main__":
    main()
