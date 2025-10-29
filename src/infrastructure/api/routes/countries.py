from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.persistence.database import get_db
from src.infrastructure.persistence.repositories.country_repository_impl import PostgresCountryRepository
from src.infrastructure.persistence.repositories.denomination_repository_impl import PostgresDenominationRepository
from src.domain.services.denomination_service import DenominationService
from src.application.dtos.country_dto import CountryResponse
from src.application.dtos.denomination_dto import DenominationResponse

router = APIRouter(prefix="/api/v1/countries", tags=["Countries"])


def get_denomination_service(db: AsyncSession = Depends(get_db)) -> DenominationService:
    country_repo = PostgresCountryRepository(db)
    denomination_repo = PostgresDenominationRepository(db)
    return DenominationService(denomination_repo, country_repo)


@router.get("", response_model=List[CountryResponse])
async def get_all_countries(
    service: DenominationService = Depends(get_denomination_service)
):
    countries = await service.get_all_countries()
    return [CountryResponse.from_domain(country) for country in countries]


@router.get("/{country_code}", response_model=CountryResponse)
async def get_country(
    country_code: str,
    service: DenominationService = Depends(get_denomination_service)
):
    try:
        country = await service.get_country(country_code)
        return CountryResponse.from_domain(country)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{country_code}/denominations", response_model=List[DenominationResponse])
async def get_country_denominations(
    country_code: str,
    active_only: bool = True,
    service: DenominationService = Depends(get_denomination_service)
):
    try:
        denominations = await service.get_denominations_for_country(country_code, active_only)
        return [DenominationResponse.from_domain(denom) for denom in denominations]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
