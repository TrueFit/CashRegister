from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Denomination:

    id: Optional[int]
    country_code: str
    value_cents: int
    singular_name: str
    plural_name: str
    denomination_type: str
    is_active: bool = True

    def __post_init__(self):
        if not isinstance(self.value_cents, int):
            raise TypeError("Value must be an integer (cents)")

        if self.value_cents <= 0:
            raise ValueError("Denomination value must be positive")

        if not self.country_code:
            raise ValueError("Country code is required")

        if not self.singular_name:
            raise ValueError("Singular name is required")

        if not self.plural_name:
            raise ValueError("Plural name is required")

        if not self.denomination_type:
            raise ValueError("Denomination type is required")

    def __str__(self) -> str:
        return f"{self.singular_name} ({self.value_cents} cents)"

    def __lt__(self, other: "Denomination") -> bool:
        if not isinstance(other, Denomination):
            return NotImplemented
        return self.value_cents < other.value_cents

    def __gt__(self, other: "Denomination") -> bool:
        if not isinstance(other, Denomination):
            return NotImplemented
        return self.value_cents > other.value_cents

    def get_display_name(self, count: int = 1) -> str:
        return self.plural_name if count != 1 else self.singular_name
