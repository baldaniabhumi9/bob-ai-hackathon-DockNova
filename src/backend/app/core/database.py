"""SQLAlchemy database configuration for DockNova."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_SRC_DIR = BACKEND_DIR.parent

load_dotenv(REPO_SRC_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")

def normalize_database_url(url: str) -> str:
    """Force SQLAlchemy to use psycopg 3 for PostgreSQL URLs."""
    clean_url = url.strip()
    if not clean_url:
        return ""

    try:
        parsed = make_url(clean_url)
    except Exception:
        if clean_url.startswith("postgresql://"):
            return clean_url.replace("postgresql://", "postgresql+psycopg://", 1)
        if clean_url.startswith("postgres://"):
            return clean_url.replace("postgres://", "postgresql+psycopg://", 1)
        return clean_url

    drivername = parsed.drivername
    if drivername in {"postgresql", "postgres"}:
        parsed = parsed.set(drivername="postgresql+psycopg")

    query = dict(parsed.query)
    for key in ("sslmode", "channel_binding"):
        value = query.get(key)
        if isinstance(value, tuple):
            value = value[-1]
        if isinstance(value, str) and "=" in value:
            value = value.split("=", 1)[0]
        if value:
            query[key] = value

    parsed = parsed.set(query=query)
    return parsed.render_as_string(hide_password=False)


DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL", ""))


class Base(DeclarativeBase):
    """Base class for all DockNova database models."""


engine: Engine | None = None
SessionLocal: sessionmaker[Session] | None = None

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        future=True,
    )
    SessionLocal = sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
        future=True,
    )


def is_database_configured() -> bool:
    """Return True when DATABASE_URL produced an engine/session factory."""
    return engine is not None and SessionLocal is not None


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that opens and closes a SQLAlchemy session."""
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
