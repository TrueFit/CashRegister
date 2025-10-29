from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.repositories.country_repository import CountryRepository
from src.domain.value_objects.country import Country
from src.infrastructure.persistence.models import CountryModel


class PostgresCountryRepository(CountryRepository):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_code(self, country_code: str) -> Optional[Country]:
        result = await self.session.execute(
            select(CountryModel).where(CountryModel.country_code == country_code.upper())
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_all(self) -> List[Country]:
        result = await self.session.execute(select(CountryModel))
        models = result.scalars().all()
        return [self._to_domain(model) for model in models]

    async def exists(self, country_code: str) -> bool:
        result = await self.session.execute(
            select(CountryModel.country_code).where(CountryModel.country_code == country_code.upper())
        )
        return result.scalar_one_or_none() is not None

    @staticmethod
    def _to_domain(model: CountryModel) -> Country:
        return Country(
            country_code=model.country_code,
            name=model.name,
            currency_code=model.currency_code,
            currency_symbol=model.currency_symbol
        )
