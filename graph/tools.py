from langchain_core.tools import tool
from db.database import get_db
from db.models import Product, Cart, CartItem
from utils.change_calculator import get_change_strategy, format_change
import json

# ============================================
# CHECK TOOLS (Read-Only)
# ============================================

@tool
def get_product_catalog() -> str:
    """
    Returns the entire product catalog with names, prices, and stock levels.
    Use this to look up products and verify availability before adding to cart.
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
                "price_cents": p.price_cents,
                "stock": p.stock
            })
        return json.dumps(catalog)
    finally:
        db.close()

@tool
def get_cart_contents(session_id: str) -> str:
    """
    Returns the current contents of the cart for the given session.
    Use this to verify what items are in the cart before removing or checking out.
    
    Args:
        session_id: The current session ID.
    """
    db = next(get_db())
    try:
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart or not cart.items:
            return json.dumps({"items": [], "total_cents": 0, "total": "$0.00"})
        
        items = []
        total_cents = 0
        for item in cart.items:
            subtotal = item.quantity * item.product.price_cents
            total_cents += subtotal
            items.append({
                "product_name": item.product.name,
                "quantity": item.quantity,
                "subtotal_cents": subtotal,
                "subtotal": f"${subtotal / 100:.2f}"
            })
        
        return json.dumps({
            "items": items,
            "total_cents": total_cents,
            "total": f"${total_cents / 100:.2f}"
        })
    finally:
        db.close()

# ============================================
# UPDATE TOOLS (Modify State)
# ============================================

@tool
def add_item_tool(session_id: str, product_name: str, quantity: int = 1) -> str:
    """
    Adds an item to the cart. Only call this after verifying the product exists and has sufficient stock.
    
    Args:
        session_id: The current session ID.
        product_name: The EXACT name of the product from the catalog.
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
            cart = Cart(session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        
        # Update stock
        product.stock -= quantity
        
        # Update cart item
        cart_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.id, 
            CartItem.product_id == product.id
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
            db.add(cart_item)
        
        db.commit()
        
        # Calculate new total
        total_cents = sum(item.quantity * item.product.price_cents for item in cart.items)
        
        return f"SUCCESS: Added {quantity} x {product_name}. Cart Total: ${total_cents / 100:.2f}"
    except Exception as e:
        db.rollback()
        return f"Error adding item: {str(e)}"
    finally:
        db.close()

@tool
def remove_item_tool(session_id: str, product_name: str, quantity: int = 1) -> str:
    """
    Removes an item from the cart. Only call this after verifying the item exists in the cart.
    
    Args:
        session_id: The current session ID.
        product_name: The EXACT name of the product to remove.
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
        
        cart_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.id, 
            CartItem.product_id == product.id
        ).first()
        
        if not cart_item:
            return f"Error: '{product_name}' is not in the cart."
        
        if cart_item.quantity < quantity:
            return f"Error: You only have {cart_item.quantity} {product_name}(s) in the cart."
        
        # Refund stock
        product.stock += quantity
        
        # Update cart item
        cart_item.quantity -= quantity
        if cart_item.quantity == 0:
            db.delete(cart_item)
        
        db.commit()
        
        return f"SUCCESS: Removed {quantity} x {product_name}."
    except Exception as e:
        db.rollback()
        return f"Error removing item: {str(e)}"
    finally:
        db.close()

@tool
def checkout_tool(session_id: str, payment_amount_float: float) -> str:
    """
    Completes the purchase. Only call this after verifying the cart is not empty.
    
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
        
        # Strategy selection based on "The Twist"
        strategy = get_change_strategy(total_cents)
        change_dict = strategy.calculate_change(change_due_cents)
        change_str = format_change(change_dict)
        
        # Mark completed
        cart.status = 'completed'
        db.commit()
        
        return f"SUCCESS: Purchase complete! Total: ${total_cents/100:.2f}. Change: {change_str}"
    except Exception as e:
        db.rollback()
        return f"Error during checkout: {str(e)}"
    finally:
        db.close()

# Tool groups for different nodes
CHECK_TOOLS = [get_product_catalog, get_cart_contents]
UPDATE_TOOLS = [add_item_tool, remove_item_tool, checkout_tool]
ALL_TOOLS = CHECK_TOOLS + UPDATE_TOOLS
