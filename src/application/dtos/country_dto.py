from pydantic import BaseModel, Field

from src.domain.value_objects.country import Country


class CountryResponse(BaseModel):
    country_code: str = Field(..., description="ISO 3166-1 alpha-3 country code")
    name: str = Field(..., description="Country name")
    currency_code: str = Field(..., description="ISO 4217 currency code")
    currency_symbol: str = Field(..., description="Currency symbol")

    @classmethod
    def from_domain(cls, country: Country) -> "CountryResponse":
        return cls(
            country_code=country.country_code,
            name=country.name,
            currency_code=country.currency_code,
            currency_symbol=country.currency_symbol
        )
