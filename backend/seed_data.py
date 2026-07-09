from app.database import SessionLocal, engine, Base
from app.models import Category

Base.metadata.create_all(bind=engine)

categories = [
    ("chinese", "中文"),
    ("english", "英文"),
    ("math", "数学"),
    ("ls", "通识教育"),
    ("physics", "物理"),
    ("chemistry", "化学"),
    ("biology", "生物"),
    ("economics", "经济"),
    ("bafs", "企会财"),
    ("ict", "资讯科技"),
    ("history", "历史"),
    ("geography", "地理"),
    ("chinese_history", "中国历史"),
    ("chinese_literature", "中国文学"),
    ("music", "音乐"),
    ("visual_arts", "视觉艺术"),
    ("pe", "体育"),
]


def seed():
    db = SessionLocal()
    for name, name_zh in categories:
        if not db.query(Category).filter(Category.name == name).first():
            db.add(Category(name=name, name_zh=name_zh))
    db.commit()
    db.close()
    print("Seed complete.")


if __name__ == "__main__":
    seed()
