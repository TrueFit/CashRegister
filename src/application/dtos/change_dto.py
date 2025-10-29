from pydantic import BaseModel, Field


class ChangeRequest(BaseModel):
    owed: float = Field(..., description="Amount owed", gt=0)
    paid: float = Field(..., description="Amount paid", gt=0)
    country_code: str = Field(default="USA", description="Country code for denominations")


class ChangeResponse(BaseModel):
    change_amount: float = Field(..., description="Total change amount")
    denominations: str = Field(..., description="Formatted denomination string")
    is_random: bool = Field(..., description="Whether random strategy was used")
    country_code: str = Field(..., description="Country code used")
