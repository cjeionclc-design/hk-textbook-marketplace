from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: int
    name: str
    name_zh: str

    model_config = {"from_attributes": True}
