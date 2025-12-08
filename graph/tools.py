from langchain_core.tools import tool
from db.database import get_db
from db.models import Product, Cart, CartItem
from utils.change_calculator import get_change_strategy, format_change
from sqlalchemy.orm import Session
import json

# Helper to get DB session safely
def with_db(func):
    def wrapper(*args, **kwargs):
        db = next(get_db())
        try:
            return func(db, *args, **kwargs)
        finally:
            db.close()
    return wrapper

@tool
def get_product_catalog():
    """
    Returns the entire product catalog. 
    Use this to look up product IDs, names, prices, and stock.
    Always call this first when the user asks for a product to verify availability and get the correct ID.
    """
    db = next(get_db())
    try:
        products = db.query(Product).all()
        catalog = []
        for p in products:
            catalog.append({
                "id": p.id,
                "name": p.name,
                "price": f"${p.price_cents / 100:.2f}",
                "stock": p.stock
            })
        return json.dumps(catalog)
    finally:
        db.close()

@tool
def add_item_tool(session_id: str, product_name: str, quantity: int = 1):
    """
    Adds an item to the cart.
    Args:
        session_id: The current session ID.
        product_name: The exact name of the product to add (from the catalog).
        quantity: The number of items to add.
    """
    db = next(get_db())
    try:
        product = db.query(Product).filter(Product.name == product_name).first()
        if not product:
            return f"Error: Product '{product_name}' not found."
        
        if product.stock < quantity:
            return f"Error: Not enough stock for '{product_name}'. Only {product.stock} left."
        
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart:
            # Should exist if middleware created it, but safety first
            cart = Cart(session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
            
        # Update stock
        product.stock -= quantity
        
        # Update cart item
        cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
            db.add(cart_item)
            
        db.commit()
        
        # Calculate new total
        total_cents = 0
        for item in cart.items:
            total_cents += item.quantity * item.product.price_cents
            
        return f"Added {quantity} {product_name}(s). Cart Total: ${total_cents / 100:.2f}"
    except Exception as e:
        db.rollback()
        return f"Error adding item: {str(e)}"
    finally:
        db.close()

@tool
def remove_item_tool(session_id: str, product_name: str, quantity: int = 1):
    """
    Removes an item from the cart.
    Args:
        session_id: The current session ID.
        product_name: The exact name of the product to remove.
        quantity: The number of items to remove.
    """
    db = next(get_db())
    try:
        product = db.query(Product).filter(Product.name == product_name).first()
        if not product:
            return f"Error: Product '{product_name}' not found."
            
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart:
            return "Error: Cart not found."
            
        cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id).first()
        if not cart_item:
            return f"Error: '{product_name}' is not in the cart."
            
        if cart_item.quantity < quantity:
            return f"Error: You only have {cart_item.quantity} {product_name}(s) in the cart."
            
        # Update stock (refund)
        product.stock += quantity
        
        # Update cart item
        cart_item.quantity -= quantity
        if cart_item.quantity == 0:
            db.delete(cart_item)
            
        db.commit()
        
        return f"Removed {quantity} {product_name}(s)."
    except Exception as e:
        db.rollback()
        return f"Error removing item: {str(e)}"
    finally:
        db.close()

@tool
def checkout_tool(session_id: str, payment_amount_float: float):
    """
    Completes the purchase.
    Args:
        session_id: The current session ID.
        payment_amount_float: The amount paid by the customer (e.g., 50.00).
    """
    db = next(get_db())
    try:
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart or not cart.items:
            return "Error: Cart is empty."
            
        total_cents = sum(item.quantity * item.product.price_cents for item in cart.items)
        payment_cents = int(payment_amount_float * 100)
        
        if payment_cents < total_cents:
            return f"Error: Insufficient payment. Total is ${total_cents/100:.2f}, but you paid ${payment_amount_float:.2f}."
            
        change_due_cents = payment_cents - total_cents
        
        # Strategy
        strategy = get_change_strategy(total_cents)
        change_dict = strategy.calculate_change(change_due_cents)
        change_str = format_change(change_dict)
        
        # Mark completed
        cart.status = 'completed'
        db.commit()
        
        return f"Purchase successful! Total: ${total_cents/100:.2f}. Change: {change_str}"
    except Exception as e:
        db.rollback()
        return f"Error during checkout: {str(e)}"
    finally:
        db.close()
