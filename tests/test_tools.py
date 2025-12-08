import pytest
from unittest.mock import patch, MagicMock
from graph.tools import add_item_tool, remove_item_tool, checkout_tool, get_product_catalog
from db.database import get_db

# We need to patch get_db to use our fixture
# Since tools use `next(get_db())`, we need to mock that.

@patch('graph.tools.get_db')
def test_add_item_tool(mock_get_db, db_session):
    mock_get_db.side_effect = lambda: iter([db_session])
    
    # Add existing item
    result = add_item_tool.invoke({"session_id": "session-1", "product_name": "Milk", "quantity": 2})
    assert "Added 2 Milk" in result
    
    # Check stock
    from db.models import Product, Cart
    p = db_session.query(Product).filter_by(name="Milk").first()
    assert p.stock == 8
    
    # Check Cart
    c = db_session.query(Cart).filter_by(session_id="session-1").first()
    assert c is not None
    assert len(c.items) == 1
    assert c.items[0].quantity == 2

@patch('graph.tools.get_db')
def test_add_item_insufficient_stock(mock_get_db, db_session):
    mock_get_db.side_effect = lambda: iter([db_session])
    
    # Milk has 10 stock
    result = add_item_tool.invoke({"session_id": "session-2", "product_name": "Milk", "quantity": 11})
    assert "Not enough stock" in result

@patch('graph.tools.get_db')
def test_checkout_tool(mock_get_db, db_session):
    mock_get_db.side_effect = lambda: iter([db_session])
    
    # Setup cart
    add_item_tool.invoke({"session_id": "session-checkout", "product_name": "Milk", "quantity": 1}) # $20.00
    
    # Pay enough
    result = checkout_tool.invoke({"session_id": "session-checkout", "payment_amount_float": 25.00})
    assert "Purchase successful" in result
    assert "Change: 5 dollars" in result or "Change: 1 5 dollar" in str(result) # Format might vary
    
    # Check status
    from db.models import Cart
    c = db_session.query(Cart).filter_by(session_id="session-checkout").first()
    assert c.status == 'completed'
