from db.models import Product, Cart, CartItem

def test_create_product(db_session):
    product = Product(name="Test Product", price_cents=1000, stock=50)
    db_session.add(product)
    db_session.commit()
    
    retrieved = db_session.query(Product).filter_by(name="Test Product").first()
    assert retrieved is not None
    assert retrieved.price_cents == 1000

def test_cart_workflow(db_session):
    # Create Cart
    cart = Cart(session_id="test-session")
    db_session.add(cart)
    db_session.commit()
    
    # Add Item
    product = db_session.query(Product).first()
    cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=2)
    db_session.add(cart_item)
    db_session.commit()
    
    assert len(cart.items) == 1
    assert cart.items[0].quantity == 2
