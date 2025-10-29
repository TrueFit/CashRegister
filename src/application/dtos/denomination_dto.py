from pydantic import BaseModel, Field
from typing import Optional

from src.domain.value_objects.denomination import Denomination


class DenominationResponse(BaseModel):
    id: Optional[int] = Field(None, description="Denomination ID")
    country_code: str = Field(..., description="Country code")
    value_cents: int = Field(..., description="Value in cents")
    singular_name: str = Field(..., description="Singular name (e.g., 'dollar')")
    plural_name: str = Field(..., description="Plural name (e.g., 'dollars')")
    denomination_type: str = Field(..., description="Denomination type enum")
    is_active: bool = Field(True, description="Whether denomination is active")

    @classmethod
    def from_domain(cls, denomination: Denomination) -> "DenominationResponse":
        return cls(
            id=denomination.id,
            country_code=denomination.country_code,
            value_cents=denomination.value_cents,
            singular_name=denomination.singular_name,
            plural_name=denomination.plural_name,
            denomination_type=denomination.denomination_type,
            is_active=denomination.is_active
        )


class DenominationCreateRequest(BaseModel):
    country_code: str = Field(..., min_length=3, max_length=3)
    value_cents: int = Field(..., gt=0)
    singular_name: str = Field(..., min_length=1)
    plural_name: str = Field(..., min_length=1)
    denomination_type: str = Field(..., min_length=1)
    is_active: bool = Field(default=True)

    def to_domain(self) -> Denomination:
        return Denomination(
            id=None,
            country_code=self.country_code,
            value_cents=self.value_cents,
            singular_name=self.singular_name,
            plural_name=self.plural_name,
            denomination_type=self.denomination_type,
            is_active=self.is_active
        )
