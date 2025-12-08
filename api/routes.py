from flask import Blueprint, request, jsonify
from db.database import get_db
from db.models import Cart, CartItem, Product
from graph.agent import agent_app
from langchain_core.messages import HumanMessage, AIMessage
import uuid

api_bp = Blueprint('api', __name__)

@api_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get('session_id')
    message = data.get('message')
    
    if not session_id or not message:
        return jsonify({"error": "Missing session_id or message"}), 400
        
    db = next(get_db())
    try:
        # Get or create cart
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart:
            cart = Cart(session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
            
        # Handle /clear command
        if message.strip() == '/clear':
            # Restore stock
            for item in cart.items:
                item.product.stock += item.quantity
            
            # Clear items
            db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
            
            # Clear history
            cart.history = []
            cart.status = 'active'
            
            db.commit()
            return jsonify({
                "text": "Cart cleared.",
                "cart_data": [],
                "inventory_data": _get_inventory_data(db)
            })
            
        # Prepare LangGraph state
        # Reconstruct history from stored JSON
        history_messages = []
        if cart.history:
            for msg in cart.history:
                if msg['role'] == 'user':
                    history_messages.append(HumanMessage(content=msg['content']))
                elif msg['role'] == 'ai':
                    history_messages.append(AIMessage(content=msg['content']))
        
        # Invoke Agent
        inputs = {
            "messages": history_messages + [HumanMessage(content=message)],
            "session_id": session_id
        }
        
        result = agent_app.invoke(inputs)
        last_message = result["messages"][-1]
        response_text = last_message.content
        
        # Update History
        new_history = list(cart.history) if cart.history else []
        new_history.append({"role": "user", "content": message})
        new_history.append({"role": "ai", "content": response_text})
        cart.history = new_history
        
        db.commit()
        
        return jsonify({
            "text": response_text,
            "cart_data": _get_cart_data(cart),
            "inventory_data": _get_inventory_data(db)
        })
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@api_bp.route('/state', methods=['GET'])
def get_state():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400
        
    db = next(get_db())
    try:
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()
        if not cart:
            cart = Cart(session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
            
        return jsonify({
            "cart_data": _get_cart_data(cart),
            "inventory_data": _get_inventory_data(db),
            "history": cart.history
        })
    finally:
        db.close()

def _get_cart_data(cart):
    data = []
    for item in cart.items:
        data.append({
            "product_name": item.product.name,
            "quantity": item.quantity,
            "subtotal": f"${(item.quantity * item.product.price_cents) / 100:.2f}"
        })
    return data

def _get_inventory_data(db):
    products = db.query(Product).all()
    data = []
    for p in products:
        data.append({
            "name": p.name,
            "price": f"${p.price_cents / 100:.2f}",
            "stock": p.stock
        })
    return data
