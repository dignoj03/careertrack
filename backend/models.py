from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    location = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    status = Column(String, nullable=False)
    date_applied = Column(String, nullable=False)

    job_link = Column(String, nullable=True)
    salary_range = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    follow_up_date = Column(String, nullable=True)
    follow_up_completed = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(Integer, nullable=False)

    interview_type = Column(String, nullable=False)
    interview_date = Column(String, nullable=False)
    interview_time = Column(String, nullable=True)
    interview_status = Column(String, nullable=False, default="Scheduled")

    notes = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)