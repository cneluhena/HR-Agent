from langchain_core.tools import tool

@tool
def get_leave_balance(employee_id: str) -> dict:
    """Get the remaining leave balance for an employee"""
    return {
        "annual_leave": 8,
        "sick_leave": 5,
        "casual_leave": 3
    }

@tool
def submit_leave_request(employee_id: str, leave_type: str, start_date: str, end_date: str) -> dict:
    """Submit a leave request for an employee"""
    return {"status": "submitted", "request_id": "LR-2024-0042"}