from typing import List
from src.domain.repositories.denomination_repository import DenominationRepository
from src.domain.repositories.country_repository import CountryRepository
from src.domain.value_objects.denomination import Denomination
from src.domain.value_objects.country import Country


class DenominationService:

    def __init__(
        self,
        denomination_repository: DenominationRepository,
        country_repository: CountryRepository
    ):
        self.denomination_repository = denomination_repository
        self.country_repository = country_repository

    async def get_denominations_for_country(
        self,
        country_code: str,
        active_only: bool = True
    ) -> List[Denomination]:
        country = await self.country_repository.get_by_code(country_code)
        if not country:
            raise ValueError(f"Country with code {country_code} not found")

        return await self.denomination_repository.get_by_country(country_code, active_only)

    async def get_country(self, country_code: str) -> Country:
        country = await self.country_repository.get_by_code(country_code)
        if not country:
            raise ValueError(f"Country with code {country_code} not found")
        return country

    async def get_all_countries(self) -> List[Country]:
        return await self.country_repository.get_all()

    async def validate_country_exists(self, country_code: str) -> bool:
        return await self.country_repository.exists(country_code)
