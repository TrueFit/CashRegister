"""create countries and denominations tables

Revision ID: 001
Revises:
Create Date: 2025-10-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'countries',
        sa.Column('country_code', sa.String(3), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('currency_code', sa.String(3), nullable=False),
        sa.Column('currency_symbol', sa.String(10), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'denominations',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('country_code', sa.String(3), sa.ForeignKey('countries.country_code', ondelete='CASCADE'), nullable=False),
        sa.Column('value_cents', sa.Integer(), nullable=False),
        sa.Column('singular_name', sa.String(50), nullable=False),
        sa.Column('plural_name', sa.String(50), nullable=False),
        sa.Column('denomination_type', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.UniqueConstraint('country_code', 'value_cents', name='unique_denomination_per_country'),
        sa.CheckConstraint('value_cents > 0', name='positive_value')
    )

    op.create_index('idx_denominations_country', 'denominations', ['country_code'])
    op.create_index('idx_denominations_active', 'denominations', ['is_active'])
    op.create_index('idx_denominations_value', 'denominations', ['value_cents'], unique=False, postgresql_ops={'value_cents': 'DESC'})


def downgrade() -> None:
    op.drop_index('idx_denominations_value', table_name='denominations')
    op.drop_index('idx_denominations_active', table_name='denominations')
    op.drop_index('idx_denominations_country', table_name='denominations')
    op.drop_table('denominations')
    op.drop_table('countries')
