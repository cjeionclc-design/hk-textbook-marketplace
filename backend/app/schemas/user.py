import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nickname: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    nickname: str
    email: str
    avatar: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
