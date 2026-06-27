from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from .database import engine, get_db, Base
from . import models

# Automatically create all tables in PostgreSQL on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hikmah Academy Full-Stack API",
    description="FastAPI + PostgreSQL backend for Comparative Theology & Library Archive",
    version="1.0.0"
)

# CORS Middleware (Crucial so that your React App can fetch from the FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your actual app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas for Input Validation ---

class SocialsSchema(BaseModel):
    youtube: Optional[str] = None
    telegram: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None

class BookCreate(BaseModel):
    title: str
    description: Optional[str] = None
    pdf_url: str
    pages_count: int = 1
    content: Optional[str] = None
    ustaz_id: int

class BookResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    pdf_url: str
    pages_count: int
    content: Optional[str] = None
    ustaz_id: int

    class Config:
        from_attributes = True

class UstazCreate(BaseModel):
    name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    contributions: Optional[str] = None
    youtube: Optional[str] = None
    telegram: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None

class UstazResponse(BaseModel):
    id: int
    name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    contributions: Optional[str] = None
    youtube: Optional[str] = None
    telegram: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None
    books: List[BookResponse] = []

    class Config:
        from_attributes = True

class ArticlePartCreate(BaseModel):
    part_number: int
    title: str
    content: str
    read_time: Optional[str] = None

class ArticlePartResponse(BaseModel):
    part_number: int
    title: str
    content: str
    read_time: Optional[str] = None

    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    category: str = "General"
    author: str
    read_time: str = "5 min"
    date: str = "June 2026"
    image: Optional[str] = None
    featured: bool = False
    scholar_quote: Optional[str] = None
    tags: List[str] = []
    ustaz_id: Optional[int] = None
    parts: List[ArticlePartCreate] = []

class ArticleResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    category: str
    author: str
    read_time: str
    date: str
    image: Optional[str] = None
    featured: bool
    scholar_quote: Optional[str] = None
    tags: Optional[List[str]] = []
    ustaz_id: Optional[int] = None
    parts: List[ArticlePartResponse] = []

    class Config:
        from_attributes = True


# --- API Routes ---

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Hikmah Academy API connected successfully!",
        "database": "PostgreSQL Connected",
        "architecture": "Full-Stack (FastAPI + SQLAlchemy + Pydantic)"
    }

# --- Ustazs (Scholars) Endpoints ---

@app.get("/ustazs/", response_model=List[UstazResponse])
def get_ustazs(db: Session = Depends(get_db)):
    return db.query(models.Ustaz).all()

@app.post("/ustazs/", response_model=UstazResponse)
def create_ustaz(ustaz: UstazCreate, db: Session = Depends(get_db)):
    # Check if name already exists
    db_ustaz = db.query(models.Ustaz).filter(models.Ustaz.name == ustaz.name).first()
    if db_ustaz:
         raise HTTPException(status_code=400, detail="Ustaz with this name already exists")
    
    new_ustaz = models.Ustaz(
        name=ustaz.name,
        title=ustaz.title,
        bio=ustaz.bio,
        image=ustaz.image,
        contributions=ustaz.contributions,
        youtube=ustaz.youtube,
        telegram=ustaz.telegram,
        website=ustaz.website,
        facebook=ustaz.facebook
    )
    db.add(new_ustaz)
    db.commit()
    db.refresh(new_ustaz)
    return new_ustaz

# --- Books (PDF Library) Endpoints ---

@app.get("/books/", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db)):
    return db.query(models.Book).all()

@app.post("/books/", response_model=BookResponse)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    # Verify Ustaz exists
    ustaz = db.query(models.Ustaz).filter(models.Ustaz.id == book.ustaz_id).first()
    if not ustaz:
        raise HTTPException(status_code=404, detail="Ustaz not found")
    
    new_book = models.Book(
        title=book.title,
        description=book.description,
        pdf_url=book.pdf_url,
        pages_count=book.pages_count,
        content=book.content,
        ustaz_id=book.ustaz_id
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

# --- Articles Endpoints ---

@app.get("/articles/", response_model=List[ArticleResponse])
def get_articles(db: Session = Depends(get_db)):
    return db.query(models.Article).all()

@app.post("/articles/", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    # Check if article already exists
    db_art = db.query(models.Article).filter(models.Article.id == article.id).first()
    if db_art:
        # Delete old article and its parts first to perform an overwrite/update
        db.delete(db_art)
        db.commit()
    
    # Check if author exists as an Ustaz, automatically link them if found!
    ustaz = db.query(models.Ustaz).filter(models.Ustaz.name == article.author).first()
    ustaz_id = ustaz.id if ustaz else article.ustaz_id

    new_art = models.Article(
        id=article.id,
        title=article.title,
        description=article.description,
        content=article.content,
        category=article.category,
        author=article.author,
        read_time=article.read_time,
        date=article.date,
        image=article.image,
        featured=article.featured,
        scholar_quote=article.scholar_quote,
        tags=article.tags,
        ustaz_id=ustaz_id
    )
    db.add(new_art)
    db.commit()

    # Add any sub-parts/chapters
    for p in article.parts:
        part_obj = models.ArticlePart(
            part_number=p.part_number,
            title=p.title,
            content=p.content,
            read_time=p.read_time,
            article_id=article.id
        )
        db.add(part_obj)
    
    db.commit()
    db.refresh(new_art)
    return new_art
