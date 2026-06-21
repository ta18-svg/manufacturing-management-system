export type MachiningRequestStatus = "not_started" | "in_progress" | "completed" | "on_hold";

export interface MachiningRequestCreateInput {
  product_code: string;
  product_name: string;
  quantity: number;
  due_date: string;
}

export interface MachiningRequestCreatedBy {
  id: number;
  name: string;
}

export interface MachiningRequest {
  id: number;
  request_no: string;
  product_code: string;
  product_name: string;
  quantity: number;
  due_date: string;
  status: MachiningRequestStatus;
  created_by: MachiningRequestCreatedBy;
  created_at: string;
  updated_at: string;
}

export type MachiningProcessStatus = MachiningRequestStatus;

export interface MachiningProcessOperator {
  id: number;
  name: string;
}

export interface MachiningProcessCreateInput {
  process_no: number;
  process_name: string;
  operator_id: number | null;
}

export interface MachiningProcess {
  id: number;
  machining_request_id: number;
  process_no: number;
  process_name: string;
  operator: MachiningProcessOperator | null;
  status: MachiningProcessStatus;
  created_at: string;
  updated_at: string;
}
