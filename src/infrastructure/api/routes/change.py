from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
import tempfile
from pathlib import Path

from src.infrastructure.persistence.database import get_db
from src.infrastructure.persistence.repositories.denomination_repository_impl import PostgresDenominationRepository
from src.domain.services.change_calculator import ChangeCalculator
from src.application.use_cases.process_change_calculation import ProcessChangeCalculationUseCase
from src.application.dtos.change_dto import ChangeRequest, ChangeResponse
from src.shared.config import settings
from src.domain.value_objects.money import Money

router = APIRouter(prefix="/api/v1/change", tags=["Change Calculation"])


def get_change_use_case(db: AsyncSession = Depends(get_db)) -> ProcessChangeCalculationUseCase:
    denomination_repo = PostgresDenominationRepository(db)
    change_calculator = ChangeCalculator()
    return ProcessChangeCalculationUseCase(
        denomination_repository=denomination_repo,
        change_calculator=change_calculator,
        divisibility_rule=settings.CHANGE_DIVISIBILITY_RULE
    )


@router.post("/calculate", response_model=ChangeResponse)
async def calculate_change(
    request: ChangeRequest,
    use_case: ProcessChangeCalculationUseCase = Depends(get_change_use_case)
):
    try:
        owed = Money(Decimal(str(request.owed)))
        paid = Money(Decimal(str(request.paid)))

        if paid < owed:
            raise HTTPException(
                status_code=400,
                detail=f"Paid amount ({paid.amount}) is less than owed ({owed.amount})"
            )

        change = paid - owed
        result = await use_case.calculate_change(change, owed, request.country_code)

        return ChangeResponse(
            change_amount=float(change.amount),
            denominations=result.format_output(),
            is_random=result.is_random,
            country_code=request.country_code
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/process-file")
async def process_file(
    file: UploadFile = File(...),
    country_code: str = "USA",
    use_case: ProcessChangeCalculationUseCase = Depends(get_change_use_case)
):
    if not file.filename.endswith(('.txt', '.csv')):
        raise HTTPException(status_code=400, detail="File must be .txt or .csv")

    try:
        with tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.txt') as tmp_input:
            content = await file.read()
            tmp_input.write(content)
            tmp_input_path = tmp_input.name

        tmp_output_path = tmp_input_path + '.output.txt'

        await use_case.execute_from_file(tmp_input_path, tmp_output_path, country_code)

        with open(tmp_output_path, 'r') as f:
            results = [line.strip() for line in f if line.strip()]

        Path(tmp_input_path).unlink()
        Path(tmp_output_path).unlink()

        return {
            "status": "success",
            "results": results,
            "count": len(results)
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
