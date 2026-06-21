from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.machining.model import MachiningProcessStatus, MachiningRequestStatus


class MachiningRequestCreate(BaseModel):
    product_code: str = Field(min_length=1, max_length=100)
    product_name: str = Field(min_length=1, max_length=255)
    quantity: int = Field(gt=0)
    due_date: date


class CreatedByResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class MachiningRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    request_no: str
    product_code: str
    product_name: str
    quantity: int
    due_date: date
    status: MachiningRequestStatus
    created_by: CreatedByResponse
    created_at: datetime
    updated_at: datetime


class MachiningProcessCreate(BaseModel):
    process_no: int = Field(gt=0)
    process_name: str = Field(min_length=1, max_length=100)
    operator_id: int | None = None


class MachiningProcessUpdate(BaseModel):
    process_no: int = Field(gt=0)
    process_name: str = Field(min_length=1, max_length=100)
    operator_id: int | None = None


class MachiningProcessStatusUpdate(BaseModel):
    status: MachiningProcessStatus


class OperatorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class MachiningProcessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    machining_request_id: int
    process_no: int
    process_name: str
    operator: OperatorResponse | None
    status: MachiningProcessStatus
    created_at: datetime
    updated_at: datetime
