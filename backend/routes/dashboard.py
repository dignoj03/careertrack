from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date

from database import SessionLocal
import models

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_applications = db.query(models.Application).count()

    interviews = db.query(models.Application).filter(
        models.Application.status == "Interview"
    ).count()

    offers = db.query(models.Application).filter(
        models.Application.status == "Offer"
    ).count()

    rejections = db.query(models.Application).filter(
        models.Application.status == "Rejected"
    ).count()

    saved_jobs = db.query(models.Application).filter(
        models.Application.status == "Saved"
    ).count()

    current_month = datetime.now().strftime("%Y-%m")

    applications_this_month = db.query(models.Application).filter(
        models.Application.date_applied.like(f"{current_month}%")
    ).count()

    today = date.today().isoformat()

    follow_ups_due = db.query(models.Application).filter(
        models.Application.follow_up_date.isnot(None),
        models.Application.follow_up_date != "",
        models.Application.follow_up_date <= today,
        models.Application.follow_up_completed == False
    ).count()

    status_counts = db.query(
        models.Application.status,
        func.count(models.Application.id)
    ).group_by(models.Application.status).all()

    status_breakdown = [
        {"status": status, "count": count}
        for status, count in status_counts
    ]

    response_rate = 0
    if total_applications > 0:
        response_rate = round(
            ((interviews + offers + rejections) / total_applications) * 100,
            2
        )

    recent_applications = db.query(models.Application).order_by(
        models.Application.created_at.desc()
    ).limit(5).all()

    upcoming_interviews = db.query(models.Interview).filter(
        models.Interview.interview_date >= today,
        models.Interview.interview_status == "Scheduled"
    ).order_by(models.Interview.interview_date.asc()).limit(5).all()

    upcoming_interviews_data = []

    for interview in upcoming_interviews:
        application = db.query(models.Application).filter(
            models.Application.id == interview.application_id
        ).first()

        upcoming_interviews_data.append({
            "id": interview.id,
            "company": application.company if application else "Unknown Company",
            "job_title": application.job_title if application else "Unknown Role",
            "interview_type": interview.interview_type,
            "interview_date": interview.interview_date,
            "interview_time": interview.interview_time,
            "interview_status": interview.interview_status,
            "notes": interview.notes
        })

    return {
        "total_applications": total_applications,
        "applications_this_month": applications_this_month,
        "interviews": interviews,
        "offers": offers,
        "rejections": rejections,
        "response_rate": response_rate,
        "follow_ups_due": follow_ups_due,
        "saved_jobs": saved_jobs,
        "status_breakdown": status_breakdown,
        "recent_applications": recent_applications,
        "upcoming_interviews": upcoming_interviews_data
    }