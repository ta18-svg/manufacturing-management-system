import enum

from sqlalchemy import Column, Date, DateTime, Enum as SAEnum, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class MachiningRequestStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"


class MachiningRequest(Base):
    __tablename__ = "machining_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    request_no = Column(String(50), unique=True, nullable=False)
    product_code = Column(String(100), nullable=False)
    product_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(
        SAEnum(MachiningRequestStatus, name="machining_request_status", native_enum=False, length=20),
        nullable=False,
        default=MachiningRequestStatus.NOT_STARTED,
        server_default=MachiningRequestStatus.NOT_STARTED.value,
    )
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    created_by = relationship("User")


class MachiningProcessStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"


class MachiningProcess(Base):
    __tablename__ = "machining_processes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    machining_request_id = Column(Integer, ForeignKey("machining_requests.id"), nullable=False)
    process_no = Column(Integer, nullable=False)
    process_name = Column(String(100), nullable=False)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(
        SAEnum(MachiningProcessStatus, name="machining_process_status", native_enum=False, length=20),
        nullable=False,
        default=MachiningProcessStatus.NOT_STARTED,
        server_default=MachiningProcessStatus.NOT_STARTED.value,
    )
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    machining_request = relationship("MachiningRequest")
    operator = relationship("User")
