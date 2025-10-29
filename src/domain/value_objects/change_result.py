from dataclasses import dataclass
from typing import Dict
from src.domain.value_objects.denomination import Denomination


@dataclass(frozen=True)
class ChangeResult:

    denominations: Dict[Denomination, int]
    is_random: bool = False

    def __post_init__(self):
        if not isinstance(self.denominations, dict):
            raise TypeError("Denominations must be a dictionary")

        for denom, count in self.denominations.items():
            if not isinstance(denom, Denomination):
                raise TypeError("Keys must be Denomination objects")
            if not isinstance(count, int) or count < 0:
                raise ValueError("Counts must be non-negative integers")

    def format_output(self) -> str:
        if not self.denominations:
            return "No change"

        parts = []
        sorted_denoms = sorted(self.denominations.items(), key=lambda x: x[0].value_cents, reverse=True)

        for denom, count in sorted_denoms:
            if count > 0:
                name = denom.get_display_name(count)
                parts.append(f"{count} {name}")

        return ",".join(parts)

    def get_total_cents(self) -> int:
        return sum(denom.value_cents * count for denom, count in self.denominations.items())
