"""CLI wrapper for seeding DockNova PostgreSQL data."""

from app.data.seed_postgres import seed_database


if __name__ == "__main__":
    result = seed_database()
    print("Seeded DockNova PostgreSQL data:")
    for table, count in result.items():
        print(f"- {table}: {count}")
