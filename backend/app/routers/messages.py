from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func

from app.database import get_db
from app.models.message import Message
from app.models.listing import Listing
from app.models.user import User
from app.schemas.message import MessageCreate, MessageOut, ConversationOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sent = db.query(Message).filter(Message.sender_id == current_user.id).all()
    received = db.query(Message).filter(Message.receiver_id == current_user.id).all()

    partner_ids = set()
    for m in sent:
        partner_ids.add((m.receiver_id, m.listing_id))
    for m in received:
        partner_ids.add((m.sender_id, m.listing_id))

    conversations = []
    for partner_id, listing_id in partner_ids:
        last_msg = (
            db.query(Message)
            .filter(
                or_(
                    and_(Message.sender_id == current_user.id, Message.receiver_id == partner_id),
                    and_(Message.sender_id == partner_id, Message.receiver_id == current_user.id),
                )
            )
            .order_by(Message.created_at.desc())
            .first()
        )

        if not last_msg:
            continue

        partner = db.query(User).filter(User.id == partner_id).first()
        listing_title = ""
        if listing_id:
            listing = db.query(Listing).filter(Listing.id == listing_id).first()
            if listing:
                listing_title = listing.textbook.title

        conversations.append(
            ConversationOut(
                partner_id=partner_id,
                partner_nickname=partner.nickname if partner else "Unknown",
                listing_id=listing_id,
                listing_title=listing_title,
                last_message=last_msg.content[:100],
                last_message_at=last_msg.created_at,
                unread_count=0,
            )
        )

    conversations.sort(key=lambda c: c.last_message_at, reverse=True)
    return conversations


@router.get("/{partner_id}", response_model=list[MessageOut])
def get_thread(
    partner_id: int,
    listing_id: int = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == partner_id),
            and_(Message.sender_id == partner_id, Message.receiver_id == current_user.id),
        )
    )
    if listing_id:
        q = q.filter(Message.listing_id == listing_id)

    messages = q.order_by(Message.created_at).all()
    result = []
    for m in messages:
        out = MessageOut.model_validate(m)
        if m.sender_id == current_user.id:
            out.sender_nickname = current_user.nickname
        else:
            partner = db.query(User).filter(User.id == partner_id).first()
            out.sender_nickname = partner.nickname if partner else "Unknown"
        result.append(out)
    return result


@router.post("", response_model=MessageOut)
def send_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    receiver = db.query(User).filter(User.id == data.receiver_id).first()
    if not receiver:
        raise HTTPException(404, "User not found")

    msg = Message(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        listing_id=data.listing_id,
        content=data.content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    out = MessageOut.model_validate(msg)
    out.sender_nickname = current_user.nickname
    return out
