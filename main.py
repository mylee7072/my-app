from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# DB 테이블 정의
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    done = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

# FastAPI 앱
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API
@app.get("/todos")
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

@app.post("/todos")
def add_todo(item: dict, db: Session = Depends(get_db)):
    todo = Todo(text=item["text"])
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return db.query(Todo).all()

@app.patch("/todos/{todo_id}")
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo:
        todo.done = not todo.done
        db.commit()
    return db.query(Todo).all()

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return db.query(Todo).all()