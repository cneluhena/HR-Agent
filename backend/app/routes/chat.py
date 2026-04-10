from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel
from app.agent.graph import agent
import json

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

    # streaming with chunk
    async for event in agent.astream_events(state, version="v2"):
        kind = event["event"]

        if kind == "on_chat_model_stream":
            chunk = event["data"]["chunk"].content
            if chunk:
                yield f"data: {json.dumps({'type': 'token', 'content': chunk})}\n\n"

        elif kind == "on_tool_start":
            yield f"data: {json.dumps({'type': 'tool_start', 'tool': event['name']})}\n\n"
        
        elif kind == "on_tool_end":
            yield f"data: {json.dumps({'type': 'tool_end', 'tool': event['name']})}\n\n"
    
    yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        stream_agent(request),
        media_type="text/event-stream"
    )



