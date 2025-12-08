from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from graph.tools import get_product_catalog, add_item_tool, remove_item_tool, checkout_tool
from graph.prompts import SYSTEM_PROMPT
from config.settings import OPENAI_API_KEY, LLM_MODEL

# Initialize LLM with tools
llm = ChatOpenAI(model=LLM_MODEL, api_key=OPENAI_API_KEY, temperature=0)
tools = [get_product_catalog, add_item_tool, remove_item_tool, checkout_tool]
llm_with_tools = llm.bind_tools(tools)

def chatbot_node(state):
    """
    The main chatbot node that invokes the LLM.
    """
    messages = state["messages"]
    session_id = state.get("session_id", "unknown")
    
    # Prepend system prompt if not present or just ensure context
    # In LangGraph, we usually keep the history in 'messages'.
    # We can prepend the system message dynamically.
    
    system_message = SystemMessage(content=SYSTEM_PROMPT.format(session_id=session_id))
    
    # Filter out previous system messages to avoid duplication if we were appending them to history
    # But here we assume 'messages' is the conversation history.
    # We construct the call: System + History
    
    response = llm_with_tools.invoke([system_message] + messages)
    
    return {"messages": [response]}
