from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal
import models
import schemas

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.InterviewResponse])
def get_interviews(db: Session = Depends(get_db)):
    interviews = db.query(models.Interview).all()
    return interviews


@router.get("/{interview_id}", response_model=schemas.InterviewResponse)
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()

    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    return interview


@router.post("/", response_model=schemas.InterviewResponse)
def create_interview(
    interview: schemas.InterviewCreate,
    db: Session = Depends(get_db)
):
    application = db.query(models.Application).filter(
        models.Application.id == interview.application_id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    new_interview = models.Interview(**interview.model_dump())
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return new_interview


@router.put("/{interview_id}", response_model=schemas.InterviewResponse)
def update_interview(
    interview_id: int,
    updated_interview: schemas.InterviewCreate,
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()

    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    application = db.query(models.Application).filter(
        models.Application.id == updated_interview.application_id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    for key, value in updated_interview.model_dump().items():
        setattr(interview, key, value)

    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/{interview_id}")
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()

    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    db.delete(interview)
    db.commit()

    return {"message": "Interview deleted successfully"}