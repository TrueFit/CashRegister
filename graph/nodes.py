from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from graph.tools import CHECK_TOOLS, UPDATE_TOOLS, get_product_catalog, get_cart_contents, add_item_tool, remove_item_tool, checkout_tool
from graph.prompts import (
    ROUTER_PROMPT, 
    CHECK_ADD_PROMPT, 
    CHECK_REMOVE_PROMPT, 
    CHECK_CHECKOUT_PROMPT,
    DECISION_PROMPT,
    RESPONSE_PROMPT,
    OFF_TOPIC_RESPONSE
)
from config.settings import OPENAI_API_KEY, LLM_MODEL
import json

# Initialize LLMs with low reasoning effort for speed
# gpt-5-nano supports: minimal, low, medium, high
llm = ChatOpenAI(
    model=LLM_MODEL, 
    api_key=OPENAI_API_KEY, 
    temperature=0,
    model_kwargs={"reasoning_effort": "low"}
)
llm_with_check_tools = llm.bind_tools(CHECK_TOOLS)
llm_with_update_tools = llm.bind_tools(UPDATE_TOOLS)

def format_history(messages) -> str:
    """Format message history for prompt injection."""
    if not messages:
        return "(No previous messages)"
    
    lines = []
    for msg in messages:
        if isinstance(msg, HumanMessage):
            lines.append(f"User: {msg.content}")
        elif isinstance(msg, AIMessage):
            lines.append(f"Assistant: {msg.content}")
    return "\n".join(lines[-10:])  # Last 10 messages for context

def get_last_user_message(messages) -> str:
    """Extract the last user message from history."""
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            return msg.content
    return ""

# ============================================
# ROUTER NODE
# ============================================
def router_node(state):
    """
    Classifies user intent into: add, remove, checkout, off_topic
    Considers conversation history for clarification responses.
    """
    messages = state["messages"]
    user_message = get_last_user_message(messages)
    history = format_history(messages[:-1])  # Exclude current message from history
    
    prompt = ROUTER_PROMPT.format(
        history=history,
        user_message=user_message
    )
    
    response = llm.invoke([
        SystemMessage(content=prompt)
    ])
    
    intent = response.content.strip().lower()
    
    # Validate intent
    valid_intents = ["add", "remove", "checkout", "off_topic"]
    if intent not in valid_intents:
        intent = "off_topic"
    
    return {"intent": intent, "user_request": user_message}

# ============================================
# CHECK NODES (Use Check Tools)
# ============================================
def check_add_node(state):
    """
    Checks product catalog for the requested item.
    Uses check tools to verify availability.
    """
    messages = state["messages"]
    session_id = state["session_id"]
    user_request = state.get("user_request", get_last_user_message(messages))
    history = format_history(messages)
    
    prompt = CHECK_ADD_PROMPT.format(
        user_request=user_request,
        session_id=session_id,
        history=history
    )
    
    # First, get the catalog
    catalog = get_product_catalog.invoke({})
    
    # Ask LLM to analyze the request against the catalog
    response = llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content=f"Product Catalog:\n{catalog}\n\nAnalyze the user's request and determine if there's an exact match, multiple matches, or no match.")
    ])
    
    return {"check_result": response.content}

def check_remove_node(state):
    """
    Checks cart contents for the requested item to remove.
    """
    messages = state["messages"]
    session_id = state["session_id"]
    user_request = state.get("user_request", get_last_user_message(messages))
    history = format_history(messages)
    
    prompt = CHECK_REMOVE_PROMPT.format(
        user_request=user_request,
        session_id=session_id,
        history=history
    )
    
    # Get cart contents
    cart = get_cart_contents.invoke({"session_id": session_id})
    
    # Also get catalog for name matching
    catalog = get_product_catalog.invoke({})
    
    response = llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content=f"Cart Contents:\n{cart}\n\nProduct Catalog:\n{catalog}\n\nAnalyze the user's request.")
    ])
    
    return {"check_result": response.content}

def check_checkout_node(state):
    """
    Verifies cart is not empty and extracts payment amount.
    """
    messages = state["messages"]
    session_id = state["session_id"]
    user_request = state.get("user_request", get_last_user_message(messages))
    history = format_history(messages)
    
    prompt = CHECK_CHECKOUT_PROMPT.format(
        user_request=user_request,
        session_id=session_id,
        history=history
    )
    
    # Get cart contents
    cart = get_cart_contents.invoke({"session_id": session_id})
    
    response = llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content=f"Cart Contents:\n{cart}\n\nUser's checkout request: {user_request}")
    ])
    
    return {"check_result": response.content}

# ============================================
# DECISION NODE (Decides: proceed or ask)
# ============================================
def decision_node(state):
    """
    Analyzes check result and decides whether to:
    - Proceed with update tool
    - Ask for clarification
    """
    messages = state["messages"]
    session_id = state["session_id"]
    intent = state["intent"]
    check_result = state.get("check_result", "")
    history = format_history(messages)
    
    prompt = DECISION_PROMPT.format(
        check_result=check_result,
        session_id=session_id,
        history=history
    )
    
    # Parse check result to determine action
    try:
        result_data = json.loads(check_result)
        status = result_data.get("status", "")
    except json.JSONDecodeError:
        # If not valid JSON, fall back to asking for clarification
        return {
            "action_result": check_result,
            "proceed_with_update": False,
            "messages": [AIMessage(content=check_result)]
        }
    
    # Determine if we should proceed
    proceed_statuses = ["exact_match", "ready"]
    if status in proceed_statuses:
        return {
            "check_data": result_data,
            "proceed_with_update": True
        }
    else:
        # Generate clarification response
        message = result_data.get("message", "I need more information to help you.")
        return {
            "action_result": message,
            "proceed_with_update": False,
            "messages": [AIMessage(content=message)]
        }

# ============================================
# UPDATE NODES (Execute Modifications)
# ============================================
def update_add_node(state):
    """Executes the add_item_tool."""
    session_id = state["session_id"]
    check_data = state.get("check_data", {})
    
    product_name = check_data.get("product_name", "")
    quantity = check_data.get("quantity", 1)
    
    result = add_item_tool.invoke({
        "session_id": session_id,
        "product_name": product_name,
        "quantity": quantity
    })
    
    return {"action_result": result}

def update_remove_node(state):
    """Executes the remove_item_tool."""
    session_id = state["session_id"]
    check_data = state.get("check_data", {})
    
    product_name = check_data.get("product_name", "")
    quantity = check_data.get("quantity", 1)
    
    result = remove_item_tool.invoke({
        "session_id": session_id,
        "product_name": product_name,
        "quantity": quantity
    })
    
    return {"action_result": result}

def update_checkout_node(state):
    """Executes the checkout_tool."""
    session_id = state["session_id"]
    check_data = state.get("check_data", {})
    
    payment_amount = check_data.get("payment_amount", 0)
    
    result = checkout_tool.invoke({
        "session_id": session_id,
        "payment_amount_float": float(payment_amount)
    })
    
    return {"action_result": result}

# ============================================
# RESPONSE NODE
# ============================================
def response_node(state):
    """Generates final user-facing response."""
    messages = state["messages"]
    session_id = state["session_id"]
    intent = state.get("intent", "")
    action_result = state.get("action_result", "")
    history = format_history(messages)
    
    prompt = RESPONSE_PROMPT.format(
        action_result=action_result,
        intent=intent,
        session_id=session_id,
        history=history
    )
    
    response = llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content="Generate a friendly response for the customer.")
    ])
    
    return {"messages": [AIMessage(content=response.content)]}

# ============================================
# OFF-TOPIC NODE
# ============================================
def off_topic_node(state):
    """Returns static off-topic response."""
    return {"messages": [AIMessage(content=OFF_TOPIC_RESPONSE)]}
