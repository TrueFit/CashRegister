from typing import List, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.repositories.denomination_repository import DenominationRepository
from src.domain.value_objects.denomination import Denomination
from src.infrastructure.persistence.models import DenominationModel


class PostgresDenominationRepository(DenominationRepository):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, denomination_id: int) -> Optional[Denomination]:
        result = await self.session.execute(
            select(DenominationModel).where(DenominationModel.id == denomination_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_by_country(self, country_code: str, active_only: bool = True) -> List[Denomination]:
        query = select(DenominationModel).where(
            DenominationModel.country_code == country_code.upper()
        )

        if active_only:
            query = query.where(DenominationModel.is_active == True)

        query = query.order_by(DenominationModel.value_cents.desc())

        result = await self.session.execute(query)
        models = result.scalars().all()
        return [self._to_domain(model) for model in models]

    async def get_all(self) -> List[Denomination]:
        result = await self.session.execute(
            select(DenominationModel).order_by(
                DenominationModel.country_code,
                DenominationModel.value_cents.desc()
            )
        )
        models = result.scalars().all()
        return [self._to_domain(model) for model in models]

    async def add(self, denomination: Denomination) -> Denomination:
        model = DenominationModel(
            country_code=denomination.country_code.upper(),
            value_cents=denomination.value_cents,
            singular_name=denomination.singular_name,
            plural_name=denomination.plural_name,
            denomination_type=denomination.denomination_type,
            is_active=denomination.is_active
        )
        self.session.add(model)
        await self.session.flush()
        await self.session.refresh(model)
        return self._to_domain(model)

    async def update(self, denomination: Denomination) -> Denomination:
        if denomination.id is None:
            raise ValueError("Denomination ID is required for update")

        result = await self.session.execute(
            select(DenominationModel).where(DenominationModel.id == denomination.id)
        )
        model = result.scalar_one_or_none()

        if not model:
            raise ValueError(f"Denomination with ID {denomination.id} not found")

        model.country_code = denomination.country_code.upper()
        model.value_cents = denomination.value_cents
        model.singular_name = denomination.singular_name
        model.plural_name = denomination.plural_name
        model.denomination_type = denomination.denomination_type
        model.is_active = denomination.is_active

        await self.session.flush()
        await self.session.refresh(model)
        return self._to_domain(model)

    async def delete(self, denomination_id: int) -> bool:
        result = await self.session.execute(
            delete(DenominationModel).where(DenominationModel.id == denomination_id)
        )
        return result.rowcount > 0

    @staticmethod
    def _to_domain(model: DenominationModel) -> Denomination:
        return Denomination(
            id=model.id,
            country_code=model.country_code,
            value_cents=model.value_cents,
            singular_name=model.singular_name,
            plural_name=model.plural_name,
            denomination_type=model.denomination_type,
            is_active=model.is_active
        )
