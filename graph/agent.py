from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import BaseMessage
import operator

from graph.nodes import chatbot_node, tools

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    session_id: str

def create_agent():
    graph_builder = StateGraph(AgentState)
    
    graph_builder.add_node("chatbot", chatbot_node)
    graph_builder.add_node("tools", ToolNode(tools))
    
    graph_builder.set_entry_point("chatbot")
    
    graph_builder.add_conditional_edges(
        "chatbot",
        tools_condition,
    )
    
    graph_builder.add_edge("tools", "chatbot")
    
    return graph_builder.compile()

agent_app = create_agent()
