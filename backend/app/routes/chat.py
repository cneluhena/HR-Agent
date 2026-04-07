from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    session_id: str
    employee_id: str


async def stream_agent(request: ChatRequest):
    state = {
        "messages": [HumanMessage(content=request.message)],
        "employee_id": request.employee_id,
        "session_id": request.session_id
    }



