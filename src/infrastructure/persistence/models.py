from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class CountryModel(Base):
    __tablename__ = 'countries'

    country_code = Column(String(3), primary_key=True)
    name = Column(String(100), nullable=False)
    currency_code = Column(String(3), nullable=False)
    currency_symbol = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    denominations = relationship("DenominationModel", back_populates="country", cascade="all, delete-orphan")


class DenominationModel(Base):
    __tablename__ = 'denominations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    country_code = Column(String(3), ForeignKey('countries.country_code', ondelete='CASCADE'), nullable=False)
    value_cents = Column(Integer, nullable=False)
    singular_name = Column(String(50), nullable=False)
    plural_name = Column(String(50), nullable=False)
    denomination_type = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    country = relationship("CountryModel", back_populates="denominations")

    __table_args__ = (
        UniqueConstraint('country_code', 'value_cents', name='unique_denomination_per_country'),
        CheckConstraint('value_cents > 0', name='positive_value'),
    )
