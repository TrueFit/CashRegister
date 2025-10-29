from typing import List, Dict
import random
from src.domain.value_objects.denomination import Denomination
from src.domain.value_objects.change_result import ChangeResult
from src.domain.value_objects.money import Money


class ChangeCalculator:

    def calculate_greedy(self, change_amount: Money, denominations: List[Denomination]) -> ChangeResult:
        sorted_denoms = sorted(denominations, key=lambda d: d.value_cents, reverse=True)
        remaining_cents = change_amount.to_cents()
        result: Dict[Denomination, int] = {}

        for denom in sorted_denoms:
            if remaining_cents == 0:
                break

            count = remaining_cents // denom.value_cents
            if count > 0:
                result[denom] = count
                remaining_cents -= count * denom.value_cents

        return ChangeResult(denominations=result, is_random=False)

    def calculate_random(self, change_amount: Money, denominations: List[Denomination]) -> ChangeResult:
        sorted_denoms = sorted(denominations, key=lambda d: d.value_cents, reverse=True)
        remaining_cents = change_amount.to_cents()

        if not sorted_denoms:
            raise ValueError("No denominations available")

        smallest_denom = sorted_denoms[-1]
        larger_denoms = sorted_denoms[:-1]

        result: Dict[Denomination, int] = {}

        random.shuffle(larger_denoms)

        for denom in larger_denoms:
            if remaining_cents == 0:
                break

            max_count = remaining_cents // denom.value_cents
            if max_count > 0:
                count = random.randint(0, max_count)
                if count > 0:
                    result[denom] = count
                    remaining_cents -= count * denom.value_cents

        if remaining_cents > 0:
            penny_count = remaining_cents // smallest_denom.value_cents
            if penny_count > 0:
                result[smallest_denom] = penny_count

        return ChangeResult(denominations=result, is_random=True)

    def calculate(
        self,
        change_amount: Money,
        denominations: List[Denomination],
        use_random: bool = False
    ) -> ChangeResult:
        if change_amount.amount < 0:
            raise ValueError("Change amount cannot be negative")

        if change_amount.amount == 0:
            return ChangeResult(denominations={}, is_random=False)

        if use_random:
            return self.calculate_random(change_amount, denominations)
        else:
            return self.calculate_greedy(change_amount, denominations)
