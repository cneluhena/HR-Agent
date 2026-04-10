from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from app.agent.state import AgentState
from app.tools.hris import get_leave_balance
from dotenv import load_dotenv

load_dotenv()


tools = []

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

def call_model(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state: AgentState):
    last = state["messages"][-1]
    if last.tool_calls:
        return "continue"
    else:
        return "end"

def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", ToolNode(tools))
    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue, {
        "continue": "tools", 
        "end": END
    })
    graph.add_edge("tools", "agent")
    return graph.compile()

agent = build_graph()
