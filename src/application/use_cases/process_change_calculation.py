from typing import List, Optional
from src.domain.value_objects.money import Money
from src.domain.value_objects.change_result import ChangeResult
from src.domain.repositories.denomination_repository import DenominationRepository
from src.domain.services.change_calculator import ChangeCalculator
from src.infrastructure.file_processor import FileProcessor


class ProcessChangeCalculationUseCase:

    def __init__(
        self,
        denomination_repository: DenominationRepository,
        change_calculator: ChangeCalculator,
        divisibility_rule: int = 3
    ):
        self.denomination_repository = denomination_repository
        self.change_calculator = change_calculator
        self.divisibility_rule = divisibility_rule

    async def execute_from_file(
        self,
        input_file: str,
        output_file: str,
        country_code: str = "USA"
    ) -> None:
        transactions = FileProcessor.read_input_file(input_file)
        denominations = await self.denomination_repository.get_by_country(country_code)

        if not denominations:
            raise ValueError(f"No denominations found for country: {country_code}")

        results = []
        for owed, paid in transactions:
            change = paid - owed
            use_random = self._should_use_random_strategy(owed.to_cents())
            result = self.change_calculator.calculate(change, denominations, use_random)
            results.append(result.format_output())

        FileProcessor.write_output_file(output_file, results)

    async def calculate_change(
        self,
        change_amount: Money,
        owed_amount: Money,
        country_code: str = "USA"
    ) -> ChangeResult:
        denominations = await self.denomination_repository.get_by_country(country_code)

        if not denominations:
            raise ValueError(f"No denominations found for country: {country_code}")

        use_random = self._should_use_random_strategy(owed_amount.to_cents())
        return self.change_calculator.calculate(change_amount, denominations, use_random)

    def _should_use_random_strategy(self, amount_cents: int) -> bool:
        return amount_cents % self.divisibility_rule == 0 and amount_cents > 0
