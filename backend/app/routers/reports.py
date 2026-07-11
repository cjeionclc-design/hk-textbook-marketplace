from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("")
def create_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = Report(
        reporter_id=current_user.id,
        listing_id=data.listing_id,
        reported_user_id=data.reported_user_id,
        reason=data.reason,
        description=data.description,
    )
    db.add(report)
    db.commit()
    return {"status": "ok"}
