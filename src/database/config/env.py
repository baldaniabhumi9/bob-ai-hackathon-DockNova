"""Alembic environment for DockNova PostgreSQL migrations."""

from __future__ import annotations

import os
from logging.config import fileConfig

from alembic import context

from app.core.database import DATABASE_URL, Base, normalize_database_url
from app.core import db_models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _database_url() -> str:
    url = normalize_database_url(os.getenv("DATABASE_URL", "")) or DATABASE_URL
    if not url:
        raise RuntimeError("DATABASE_URL is required to run migrations.")
    return url


def run_migrations_offline() -> None:
    context.configure(
        url=_database_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from sqlalchemy import create_engine

    connectable = create_engine(_database_url(), pool_pre_ping=True, future=True)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
