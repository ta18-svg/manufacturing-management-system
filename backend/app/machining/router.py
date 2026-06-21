from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_roles
from app.machining import service
from app.machining.schema import (
    MachiningProcessCreate,
    MachiningProcessResponse,
    MachiningProcessStatusUpdate,
    MachiningProcessUpdate,
    MachiningRequestCreate,
    MachiningRequestResponse,
)
from app.users.model import User

router = APIRouter(prefix="/api/machining/requests", tags=["machining"])
process_router = APIRouter(prefix="/api/machining/processes", tags=["machining"])


@router.get("", response_model=list[MachiningRequestResponse])
def list_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MachiningRequestResponse]:
    return service.list_machining_requests(db)


@router.post("", response_model=MachiningRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: MachiningRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "leader")),
) -> MachiningRequestResponse:
    return service.create_machining_request(db, payload, current_user)


@router.get("/{request_id}", response_model=MachiningRequestResponse)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MachiningRequestResponse:
    request = service.get_machining_request(db, request_id)
    if request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="加工依頼が見つかりません")
    return request


@router.get("/{request_id}/processes", response_model=list[MachiningProcessResponse])
def list_processes(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MachiningProcessResponse]:
    request = service.get_machining_request(db, request_id)
    if request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="加工依頼が見つかりません")
    return service.list_machining_processes(db, request_id)


@router.post(
    "/{request_id}/processes",
    response_model=MachiningProcessResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_process(
    request_id: int,
    payload: MachiningProcessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "leader")),
) -> MachiningProcessResponse:
    request = service.get_machining_request(db, request_id)
    if request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="加工依頼が見つかりません")
    return service.create_machining_process(db, request_id, payload)


def _get_process_or_404(db: Session, process_id: int):
    process = service.get_machining_process(db, process_id)
    if process is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="工程が見つかりません")
    return process


@process_router.put("/{process_id}", response_model=MachiningProcessResponse)
def update_process(
    process_id: int,
    payload: MachiningProcessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "leader")),
) -> MachiningProcessResponse:
    process = _get_process_or_404(db, process_id)
    return service.update_machining_process(db, process, payload)


@process_router.patch("/{process_id}/status", response_model=MachiningProcessResponse)
def update_process_status(
    process_id: int,
    payload: MachiningProcessStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "leader", "worker")),
) -> MachiningProcessResponse:
    process = _get_process_or_404(db, process_id)
    return service.update_machining_process_status(db, process, payload)
