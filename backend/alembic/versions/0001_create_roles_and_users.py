"""create roles and users tables, seed initial data

Revision ID: 0001
Revises:
Create Date: 2026-06-20

"""
from typing import Sequence, Union

import bcrypt
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

DEFAULT_ADMIN_EMAIL = "admin@example.com"
DEFAULT_ADMIN_PASSWORD = "Admin12345!"


def upgrade() -> None:
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), nullable=False, unique=True),
        sa.Column("description", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column(
            "updated_at",
            sa.DateTime,
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("role_id", sa.Integer, sa.ForeignKey("roles.id"), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column(
            "updated_at",
            sa.DateTime,
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
    )

    roles_table = sa.table(
        "roles",
        sa.column("name", sa.String),
        sa.column("description", sa.String),
    )
    op.bulk_insert(
        roles_table,
        [
            {"name": "admin", "description": "管理者"},
            {"name": "leader", "description": "現場リーダー"},
            {"name": "worker", "description": "作業者"},
            {"name": "viewer", "description": "閲覧者"},
        ],
    )

    connection = op.get_bind()
    admin_role_id = connection.execute(
        sa.text("SELECT id FROM roles WHERE name = :name"), {"name": "admin"}
    ).scalar()

    hashed_password = bcrypt.hashpw(
        DEFAULT_ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    users_table = sa.table(
        "users",
        sa.column("email", sa.String),
        sa.column("hashed_password", sa.String),
        sa.column("name", sa.String),
        sa.column("role_id", sa.Integer),
    )
    op.bulk_insert(
        users_table,
        [
            {
                "email": DEFAULT_ADMIN_EMAIL,
                "hashed_password": hashed_password,
                "name": "システム管理者",
                "role_id": admin_role_id,
            }
        ],
    )


def downgrade() -> None:
    op.drop_table("users")
    op.drop_table("roles")
