from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages



class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    employee_id: str
    session_id: str