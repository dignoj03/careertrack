from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApplicationBase(BaseModel):
    company: str
    job_title: str
    location: Optional[str] = None
    job_type: Optional[str] = None
    status: str
    date_applied: str
    job_link: Optional[str] = None
    salary_range: Optional[str] = None
    contact_person: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    follow_up_completed: bool = False


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InterviewBase(BaseModel):
    application_id: int
    interview_type: str
    interview_date: str
    interview_time: Optional[str] = None
    interview_status: str = "Scheduled"
    notes: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewResponse(InterviewBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True