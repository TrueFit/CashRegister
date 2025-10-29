"""seed initial countries and denominations data

Revision ID: 002
Revises: 001
Create Date: 2025-10-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    countries_table = sa.table('countries',
        sa.column('country_code', sa.String),
        sa.column('name', sa.String),
        sa.column('currency_code', sa.String),
        sa.column('currency_symbol', sa.String)
    )

    op.bulk_insert(countries_table, [
        {'country_code': 'USA', 'name': 'United States', 'currency_code': 'USD', 'currency_symbol': '$'},
        {'country_code': 'CAN', 'name': 'Canada', 'currency_code': 'CAD', 'currency_symbol': '$'},
        {'country_code': 'GBR', 'name': 'United Kingdom', 'currency_code': 'GBP', 'currency_symbol': '£'},
        {'country_code': 'EUR', 'name': 'Eurozone', 'currency_code': 'EUR', 'currency_symbol': '€'},
        {'country_code': 'JPN', 'name': 'Japan', 'currency_code': 'JPY', 'currency_symbol': '¥'},
    ])

    denominations_table = sa.table('denominations',
        sa.column('country_code', sa.String),
        sa.column('value_cents', sa.Integer),
        sa.column('singular_name', sa.String),
        sa.column('plural_name', sa.String),
        sa.column('denomination_type', sa.String),
        sa.column('is_active', sa.Boolean)
    )

    op.bulk_insert(denominations_table, [
        {'country_code': 'USA', 'value_cents': 100, 'singular_name': 'dollar', 'plural_name': 'dollars', 'denomination_type': 'DOLLAR', 'is_active': True},
        {'country_code': 'USA', 'value_cents': 25, 'singular_name': 'quarter', 'plural_name': 'quarters', 'denomination_type': 'QUARTER', 'is_active': True},
        {'country_code': 'USA', 'value_cents': 10, 'singular_name': 'dime', 'plural_name': 'dimes', 'denomination_type': 'DIME', 'is_active': True},
        {'country_code': 'USA', 'value_cents': 5, 'singular_name': 'nickel', 'plural_name': 'nickels', 'denomination_type': 'NICKEL', 'is_active': True},
        {'country_code': 'USA', 'value_cents': 1, 'singular_name': 'penny', 'plural_name': 'pennies', 'denomination_type': 'PENNY', 'is_active': True},

        {'country_code': 'CAN', 'value_cents': 200, 'singular_name': 'toonie', 'plural_name': 'toonies', 'denomination_type': 'TOONIE', 'is_active': True},
        {'country_code': 'CAN', 'value_cents': 100, 'singular_name': 'loonie', 'plural_name': 'loonies', 'denomination_type': 'LOONIE', 'is_active': True},
        {'country_code': 'CAN', 'value_cents': 25, 'singular_name': 'quarter', 'plural_name': 'quarters', 'denomination_type': 'QUARTER', 'is_active': True},
        {'country_code': 'CAN', 'value_cents': 10, 'singular_name': 'dime', 'plural_name': 'dimes', 'denomination_type': 'DIME', 'is_active': True},
        {'country_code': 'CAN', 'value_cents': 5, 'singular_name': 'nickel', 'plural_name': 'nickels', 'denomination_type': 'NICKEL', 'is_active': True},

        {'country_code': 'GBR', 'value_cents': 200, 'singular_name': 'two pound', 'plural_name': 'two pounds', 'denomination_type': 'TWO_POUND', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 100, 'singular_name': 'pound', 'plural_name': 'pounds', 'denomination_type': 'POUND', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 50, 'singular_name': 'fifty pence', 'plural_name': 'fifty pence', 'denomination_type': 'FIFTY_PENCE', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 20, 'singular_name': 'twenty pence', 'plural_name': 'twenty pence', 'denomination_type': 'TWENTY_PENCE', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 10, 'singular_name': 'ten pence', 'plural_name': 'ten pence', 'denomination_type': 'TEN_PENCE', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 5, 'singular_name': 'five pence', 'plural_name': 'five pence', 'denomination_type': 'FIVE_PENCE', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 2, 'singular_name': 'two pence', 'plural_name': 'two pence', 'denomination_type': 'TWO_PENCE', 'is_active': True},
        {'country_code': 'GBR', 'value_cents': 1, 'singular_name': 'penny', 'plural_name': 'pence', 'denomination_type': 'PENNY', 'is_active': True},

        {'country_code': 'EUR', 'value_cents': 200, 'singular_name': 'two euro', 'plural_name': 'two euros', 'denomination_type': 'TWO_EURO', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 100, 'singular_name': 'euro', 'plural_name': 'euros', 'denomination_type': 'EURO', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 50, 'singular_name': 'fifty cent', 'plural_name': 'fifty cents', 'denomination_type': 'FIFTY_CENT', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 20, 'singular_name': 'twenty cent', 'plural_name': 'twenty cents', 'denomination_type': 'TWENTY_CENT', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 10, 'singular_name': 'ten cent', 'plural_name': 'ten cents', 'denomination_type': 'TEN_CENT', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 5, 'singular_name': 'five cent', 'plural_name': 'five cents', 'denomination_type': 'FIVE_CENT', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 2, 'singular_name': 'two cent', 'plural_name': 'two cents', 'denomination_type': 'TWO_CENT', 'is_active': True},
        {'country_code': 'EUR', 'value_cents': 1, 'singular_name': 'cent', 'plural_name': 'cents', 'denomination_type': 'CENT', 'is_active': True},

        {'country_code': 'JPN', 'value_cents': 500, 'singular_name': '500 yen', 'plural_name': '500 yen', 'denomination_type': 'YEN_500', 'is_active': True},
        {'country_code': 'JPN', 'value_cents': 100, 'singular_name': '100 yen', 'plural_name': '100 yen', 'denomination_type': 'YEN_100', 'is_active': True},
        {'country_code': 'JPN', 'value_cents': 50, 'singular_name': '50 yen', 'plural_name': '50 yen', 'denomination_type': 'YEN_50', 'is_active': True},
        {'country_code': 'JPN', 'value_cents': 10, 'singular_name': '10 yen', 'plural_name': '10 yen', 'denomination_type': 'YEN_10', 'is_active': True},
        {'country_code': 'JPN', 'value_cents': 5, 'singular_name': '5 yen', 'plural_name': '5 yen', 'denomination_type': 'YEN_5', 'is_active': True},
        {'country_code': 'JPN', 'value_cents': 1, 'singular_name': '1 yen', 'plural_name': '1 yen', 'denomination_type': 'YEN_1', 'is_active': True},
    ])


def downgrade() -> None:
    op.execute("DELETE FROM denominations")
    op.execute("DELETE FROM countries")
