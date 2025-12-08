from typing import TypedDict, Annotated, List, Optional, Any
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage
import operator

from graph.nodes import (
    router_node,
    check_add_node,
    check_remove_node,
    check_checkout_node,
    decision_node,
    update_add_node,
    update_remove_node,
    update_checkout_node,
    response_node,
    off_topic_node
)

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    session_id: str
    intent: Optional[str]
    user_request: Optional[str]
    check_result: Optional[str]
    check_data: Optional[dict]
    proceed_with_update: Optional[bool]
    action_result: Optional[str]

def route_by_intent(state) -> str:
    """Routes to the appropriate flow based on classified intent."""
    intent = state.get("intent", "off_topic")
    
    if intent == "add":
        return "check_add"
    elif intent == "remove":
        return "check_remove"
    elif intent == "checkout":
        return "check_checkout"
    else:
        return "off_topic"

def route_by_decision(state) -> str:
    """Routes based on whether to proceed with update or respond with clarification."""
    if state.get("proceed_with_update", False):
        intent = state.get("intent", "")
        if intent == "add":
            return "update_add"
        elif intent == "remove":
            return "update_remove"
        elif intent == "checkout":
            return "update_checkout"
    return "response"

def create_agent():
    """
    Creates the LangGraph agent with the following architecture:
    
    START
      │
      ▼
    ROUTER → (classifies intent)
      │
      ├─[add]────→ CHECK_ADD → DECISION ─┬─[proceed]───→ UPDATE_ADD → RESPONSE
      │                                   └─[ask]───────→ RESPONSE
      │
      ├─[remove]─→ CHECK_REMOVE → DECISION ─┬─[proceed]→ UPDATE_REMOVE → RESPONSE
      │                                      └─[ask]────→ RESPONSE
      │
      ├─[checkout]→ CHECK_CHECKOUT → DECISION ─┬─[proceed]→ UPDATE_CHECKOUT → RESPONSE
      │                                         └─[ask]────→ RESPONSE
      │
      └─[off_topic]→ OFF_TOPIC
                          │
                          ▼
                        END
    """
    graph_builder = StateGraph(AgentState)
    
    # Add all nodes
    graph_builder.add_node("router", router_node)
    graph_builder.add_node("check_add", check_add_node)
    graph_builder.add_node("check_remove", check_remove_node)
    graph_builder.add_node("check_checkout", check_checkout_node)
    graph_builder.add_node("decision", decision_node)
    graph_builder.add_node("update_add", update_add_node)
    graph_builder.add_node("update_remove", update_remove_node)
    graph_builder.add_node("update_checkout", update_checkout_node)
    graph_builder.add_node("response", response_node)
    graph_builder.add_node("off_topic", off_topic_node)
    
    # Set entry point
    graph_builder.set_entry_point("router")
    
    # Router conditional edges
    graph_builder.add_conditional_edges(
        "router",
        route_by_intent,
        {
            "check_add": "check_add",
            "check_remove": "check_remove",
            "check_checkout": "check_checkout",
            "off_topic": "off_topic"
        }
    )
    
    # Check nodes → Decision
    graph_builder.add_edge("check_add", "decision")
    graph_builder.add_edge("check_remove", "decision")
    graph_builder.add_edge("check_checkout", "decision")
    
    # Decision conditional edges
    graph_builder.add_conditional_edges(
        "decision",
        route_by_decision,
        {
            "update_add": "update_add",
            "update_remove": "update_remove",
            "update_checkout": "update_checkout",
            "response": "response"
        }
    )
    
    # Update nodes → Response
    graph_builder.add_edge("update_add", "response")
    graph_builder.add_edge("update_remove", "response")
    graph_builder.add_edge("update_checkout", "response")
    
    # Terminal nodes → END
    graph_builder.add_edge("response", END)
    graph_builder.add_edge("off_topic", END)
    
    return graph_builder.compile()

agent_app = create_agent()
