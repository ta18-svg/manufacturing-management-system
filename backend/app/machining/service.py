from sqlalchemy.orm import Session, joinedload

from app.machining.model import MachiningProcess, MachiningRequest, MachiningRequestStatus
from app.machining.schema import (
    MachiningProcessCreate,
    MachiningProcessStatusUpdate,
    MachiningProcessUpdate,
    MachiningRequestCreate,
)
from app.users.model import User


def list_machining_requests(db: Session) -> list[MachiningRequest]:
    return (
        db.query(MachiningRequest)
        .options(joinedload(MachiningRequest.created_by))
        .order_by(MachiningRequest.id.desc())
        .all()
    )


def get_machining_request(db: Session, request_id: int) -> MachiningRequest | None:
    return (
        db.query(MachiningRequest)
        .options(joinedload(MachiningRequest.created_by))
        .filter(MachiningRequest.id == request_id)
        .first()
    )


def create_machining_request(
    db: Session, payload: MachiningRequestCreate, current_user: User
) -> MachiningRequest:
    request = MachiningRequest(
        request_no="",
        product_code=payload.product_code,
        product_name=payload.product_name,
        quantity=payload.quantity,
        due_date=payload.due_date,
        status=MachiningRequestStatus.NOT_STARTED,
        created_by_id=current_user.id,
    )
    db.add(request)
    db.flush()
    request.request_no = f"MR{request.id:06d}"
    db.commit()
    db.refresh(request)
    return request


def list_machining_processes(db: Session, request_id: int) -> list[MachiningProcess]:
    return (
        db.query(MachiningProcess)
        .options(joinedload(MachiningProcess.operator))
        .filter(MachiningProcess.machining_request_id == request_id)
        .order_by(MachiningProcess.process_no.asc())
        .all()
    )


def create_machining_process(
    db: Session, request_id: int, payload: MachiningProcessCreate
) -> MachiningProcess:
    process = MachiningProcess(
        machining_request_id=request_id,
        process_no=payload.process_no,
        process_name=payload.process_name,
        operator_id=payload.operator_id,
    )
    db.add(process)
    db.commit()
    db.refresh(process)
    return process


def get_machining_process(db: Session, process_id: int) -> MachiningProcess | None:
    return (
        db.query(MachiningProcess)
        .options(joinedload(MachiningProcess.operator))
        .filter(MachiningProcess.id == process_id)
        .first()
    )


def update_machining_process(
    db: Session, process: MachiningProcess, payload: MachiningProcessUpdate
) -> MachiningProcess:
    process.process_no = payload.process_no
    process.process_name = payload.process_name
    process.operator_id = payload.operator_id
    db.commit()
    db.refresh(process)
    return process


def update_machining_process_status(
    db: Session, process: MachiningProcess, payload: MachiningProcessStatusUpdate
) -> MachiningProcess:
    process.status = payload.status
    db.commit()
    db.refresh(process)
    return process
