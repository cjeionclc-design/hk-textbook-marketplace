from app.database import SessionLocal, engine, Base
from app.models import Category, User, Textbook, Listing
from app.services.auth import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

categories_data = [
    ("chinese","中文"),("english","英文"),("math","数学"),("ls","通识教育"),
    ("physics","物理"),("chemistry","化学"),("biology","生物"),("economics","经济"),
    ("bafs","企会财"),("ict","资讯科技"),("history","历史"),("geography","地理"),
    ("chinese_history","中国历史"),("chinese_literature","中国文学"),
    ("music","音乐"),("visual_arts","视觉艺术"),("pe","体育"),
]
for name, name_zh in categories_data:
    if not db.query(Category).filter(Category.name == name).first():
        db.add(Category(name=name, name_zh=name_zh))
db.commit()

categories = {c.name: c for c in db.query(Category).all()}

demo_users = [
    ("alice_wong", "alice@example.com", "alice123", "Alice"),
    ("brian_chan", "brian@example.com", "brian123", "Brian"),
    ("cathy_lee", "cathy@example.com", "cathy123", "Cathy"),
    ("demo_student", "demo@hktextbook.com", "demo123", "DemoUser"),
]
users = {}
for nickname, email, pw, _ in demo_users:
    u = db.query(User).filter(User.email == email).first()
    if not u:
        u = User(nickname=nickname, email=email, password_hash=hash_password(pw))
        db.add(u)
        db.commit()
        db.refresh(u)
    users[nickname] = u

textbooks_data = [
    ("New Century Mathematics 4A", "9780190978518", "Oxford", "en", 285, "math"),
    ("新高中生活與物理 3A", "9789888176939", "Oxford", "zh", 260, "physics"),
    ("HKDSE Chemistry A Modern View 3B", "9789627326588", "Aristo", "en", 290, "chemistry"),
    ("新視野中國歷史 必修1", "9789882412019", "香港教育圖書", "zh", 240, "chinese_history"),
    ("NSS Mastering Biology 2A", "9780190826581", "Oxford", "en", 275, "biology"),
    ("Longman Activate New Senior Secondary Economics 2", "9789880098970", "Pearson", "en", 250, "economics"),
    ("啟思新高中中國語文 第四冊", "9789888463039", "啟思", "zh", 220, "chinese"),
    ("New Century Mathematics 5B", "9780190978563", "Oxford", "en", 285, "math"),
    ("HKDSE Chemistry A Modern View 4A", "9789627326656", "Aristo", "en", 260, "chemistry"),
    ("Aristo HKDSE Biology 3", "9789888192854", "Aristo", "en", 290, "biology"),
    ("Mathematics In Action 4B", "9789882332874", "Pearson", "en", 270, "math"),
    ("NSS Physics at Work 3B", "9789880098789", "Oxford", "en", 255, "physics"),
]
books = {}
for title, isbn, pub, lang, price, cat_name in textbooks_data:
    t = db.query(Textbook).filter(Textbook.isbn == isbn).first()
    if not t:
        t = Textbook(title=title, isbn=isbn, publisher=pub, language=lang,
                     original_price=price, category_id=categories[cat_name].id)
        db.add(t)
        db.commit()
        db.refresh(t)
    books[isbn] = t

seller_sequence = [users["alice_wong"], users["brian_chan"], users["cathy_lee"]]
sample_listings = [
    ("9780190978518", 120, 4, "九龍塘", "只用了一個學期，少量鉛筆痕"),
    ("9789888176939", 80, 3, "旺角", "有highlight，封面少少皺"),
    ("9789627326588", 150, 5, "銅鑼灣", "全新未用過，買錯咗"),
    ("9789882412019", 60, 2, "沙田", "較多筆記，但內容完整"),
    ("9780190826581", 100, 4, "觀塘", "接近全新，只有幾頁有mark"),
    ("9789880098970", 90, 3, "金鐘", "正常使用痕跡"),
    ("9789888463039", 70, 3, "荃灣", "有notes但好有用"),
    ("9780190978563", 130, 4, "九龍塘", "只用過半個學期"),
    ("9789627326656", 140, 5, "旺角", "全新"),

    ("9789888192854", 110, 4, "銅鑼灣", "好新淨"),
    ("9789882332874", 100, 3, "觀塘", "有鉛筆notes"),
    ("9789880098789", 85, 3, "金鐘", "正常使用"),
]
for i, (isbn, price, cond, loc, note) in enumerate(sample_listings):
    existing = db.query(Listing).filter(
        Listing.textbook_id == books[isbn].id,
        Listing.seller_id == seller_sequence[i % 3].id
    ).first()
    if not existing:
        db.add(Listing(
            textbook_id=books[isbn].id,
            seller_id=seller_sequence[i % 3].id,
            price=price, condition=cond, location=loc, notes=note,
            status="active"
        ))
db.commit()
db.close()
print("Seed complete: categories, demo users, textbooks, sample listings")
