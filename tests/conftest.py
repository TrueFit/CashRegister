import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base
from db.models import Product, Cart, CartItem

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    # Seed some data
    session.add(Product(name="Milk", price_cents=2000, stock=10))
    session.add(Product(name="Coke", price_cents=1500, stock=5))
    session.commit()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(engine)

@pytest.fixture(scope="function")
def override_get_db(db_session):
    def _get_db():
        yield db_session
    return _get_db
