from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Ustaz(Base):
    __tablename__ = "ustazs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)  # URL to profile picture
    contributions = Column(Text, nullable=True) # Description of contributions
    
    # Social links
    youtube = Column(String(500), nullable=True)
    telegram = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    facebook = Column(String(500), nullable=True)

    # Relationships
    books = relationship("Book", back_populates="ustaz", cascade="all, delete-orphan")
    articles = relationship("Article", back_populates="ustaz_obj", cascade="all, delete-orphan")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=False) # URL to the hosted PDF file
    pages_count = Column(Integer, default=1)
    content = Column(Text, nullable=True) # Text excerpt / preview readable in-app
    
    ustaz_id = Column(Integer, ForeignKey("ustazs.id", ondelete="CASCADE"), nullable=False)
    ustaz = relationship("Ustaz", back_populates="books")


class Article(Base):
    __tablename__ = "articles"

    id = Column(String(255), primary_key=True, index=True) # unique alphanumeric slug
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    category = Column(String(100), default="General")
    author = Column(String(255), nullable=False) # Author name string (backward compatibility)
    read_time = Column(String(50), default="5 min")
    date = Column(String(100), default="June 2026")
    image = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
    scholar_quote = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True) # Array of tags e.g. ["Tawhid", "Theology"]

    ustaz_id = Column(Integer, ForeignKey("ustazs.id", ondelete="SET NULL"), nullable=True)
    ustaz_obj = relationship("Ustaz", back_populates="articles")
    parts = relationship("ArticlePart", back_populates="article", cascade="all, delete-orphan")


class ArticlePart(Base):
    __tablename__ = "article_parts"

    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(Integer, default=1)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    read_time = Column(String(50), nullable=True)

    article_id = Column(String(255), ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    article = relationship("Article", back_populates="parts")
