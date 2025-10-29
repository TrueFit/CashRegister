from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.value_objects.denomination import Denomination


class DenominationRepository(ABC):

    @abstractmethod
    async def get_by_id(self, denomination_id: int) -> Optional[Denomination]:
        pass

    @abstractmethod
    async def get_by_country(self, country_code: str, active_only: bool = True) -> List[Denomination]:
        pass

    @abstractmethod
    async def get_all(self) -> List[Denomination]:
        pass

    @abstractmethod
    async def add(self, denomination: Denomination) -> Denomination:
        pass

    @abstractmethod
    async def update(self, denomination: Denomination) -> Denomination:
        pass

    @abstractmethod
    async def delete(self, denomination_id: int) -> bool:
        pass
