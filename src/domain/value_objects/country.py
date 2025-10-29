from dataclasses import dataclass


@dataclass(frozen=True)
class Country:

    country_code: str
    name: str
    currency_code: str
    currency_symbol: str

    def __post_init__(self):
        if not self.country_code or len(self.country_code) != 3:
            raise ValueError("Country code must be exactly 3 characters")

        if not self.name:
            raise ValueError("Country name cannot be empty")

        if not self.currency_code or len(self.currency_code) != 3:
            raise ValueError("Currency code must be exactly 3 characters")

        if not self.currency_symbol:
            raise ValueError("Currency symbol cannot be empty")

        object.__setattr__(self, 'country_code', self.country_code.upper())
        object.__setattr__(self, 'currency_code', self.currency_code.upper())
