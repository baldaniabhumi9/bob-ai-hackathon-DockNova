"""initial DockNova PostgreSQL tables

Revision ID: 0001_initial_docknova_tables
Revises:
Create Date: 2026-09-15
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0001_initial_docknova_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "vessels",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("imo", sa.String(length=32), nullable=False, unique=True),
        sa.Column("type", sa.String(length=48), nullable=False),
        sa.Column("eta", sa.DateTime(timezone=True), nullable=False),
        sa.Column("etd", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("draft_meters", sa.Float(), nullable=False),
        sa.Column("length_meters", sa.Float(), nullable=False),
        sa.Column("priority", sa.String(length=32), nullable=False),
        sa.Column("estimated_handling_hours", sa.Float(), nullable=False),
    )
    op.create_table(
        "berths",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("code", sa.String(length=32), nullable=False, unique=True),
        sa.Column("max_draft_meters", sa.Float(), nullable=False),
        sa.Column("max_length_meters", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("current_vessel_id", sa.String(length=32), nullable=True),
        sa.Column("compatible_vessel_types", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("availability_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("availability_end", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "cranes",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("berth_id", sa.String(length=32), sa.ForeignKey("berths.id"), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("capacity_teu_per_hour", sa.Float(), nullable=False),
    )
    op.create_table(
        "vessel_workloads",
        sa.Column("vessel_id", sa.String(length=32), sa.ForeignKey("vessels.id"), primary_key=True),
        sa.Column("workload_teu", sa.Float(), nullable=False),
    )
    op.create_table(
        "historical_metrics",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("vessel_arrivals", sa.Float(), nullable=False),
        sa.Column("waiting_vessels", sa.Float(), nullable=False),
        sa.Column("berth_utilization_pct", sa.Float(), nullable=False),
        sa.Column("crane_utilization_pct", sa.Float(), nullable=False),
        sa.Column("yard_occupancy_pct", sa.Float(), nullable=False),
        sa.Column("avg_service_time_hours", sa.Float(), nullable=False),
        sa.Column("hour_of_day", sa.Integer(), nullable=False),
        sa.Column("vessel_priority_avg", sa.Float(), nullable=False),
        sa.Column("congestion_label", sa.Integer(), nullable=False),
        sa.Column("wait_time_hours", sa.Float(), nullable=False),
    )
    op.create_table(
        "alternative_ports",
        sa.Column("port_id", sa.String(length=32), primary_key=True),
        sa.Column("port_name", sa.String(length=160), nullable=False),
        sa.Column("congestion_level", sa.String(length=32), nullable=False),
        sa.Column("predicted_wait_time_hours", sa.Float(), nullable=False),
        sa.Column("travel_time_hours", sa.Float(), nullable=False),
        sa.Column("travel_cost_usd", sa.Float(), nullable=False),
        sa.Column("available_berths", sa.Integer(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("alternative_ports")
    op.drop_table("historical_metrics")
    op.drop_table("vessel_workloads")
    op.drop_table("cranes")
    op.drop_table("berths")
    op.drop_table("vessels")
