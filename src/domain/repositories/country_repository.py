from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.value_objects.country import Country


class CountryRepository(ABC):

    @abstractmethod
    async def get_by_code(self, country_code: str) -> Optional[Country]:
        pass

    @abstractmethod
    async def get_all(self) -> List[Country]:
        pass

    @abstractmethod
    async def exists(self, country_code: str) -> bool:
        pass
