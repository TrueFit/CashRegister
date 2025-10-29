import pytest
from decimal import Decimal
from src.domain.value_objects.denomination import Denomination


@pytest.fixture
def us_denominations():
    return [
        Denomination(id=1, country_code='USA', value_cents=100, singular_name='dollar', plural_name='dollars', denomination_type='DOLLAR'),
        Denomination(id=2, country_code='USA', value_cents=25, singular_name='quarter', plural_name='quarters', denomination_type='QUARTER'),
        Denomination(id=3, country_code='USA', value_cents=10, singular_name='dime', plural_name='dimes', denomination_type='DIME'),
        Denomination(id=4, country_code='USA', value_cents=5, singular_name='nickel', plural_name='nickels', denomination_type='NICKEL'),
        Denomination(id=5, country_code='USA', value_cents=1, singular_name='penny', plural_name='pennies', denomination_type='PENNY'),
    ]


@pytest.fixture
def sample_transactions():
    return [
        (Decimal("2.12"), Decimal("3.00")),
        (Decimal("1.97"), Decimal("2.00")),
        (Decimal("3.33"), Decimal("5.00")),
    ]
