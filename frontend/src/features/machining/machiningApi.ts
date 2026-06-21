import { apiClient } from "../../lib/api/client";
import type {
  MachiningProcess,
  MachiningProcessCreateInput,
  MachiningProcessStatus,
  MachiningRequest,
  MachiningRequestCreateInput,
} from "./types";

export async function fetchMachiningRequests(): Promise<MachiningRequest[]> {
  const response = await apiClient.get<MachiningRequest[]>("/api/machining/requests");
  return response.data;
}

export async function fetchMachiningRequest(id: number): Promise<MachiningRequest> {
  const response = await apiClient.get<MachiningRequest>(`/api/machining/requests/${id}`);
  return response.data;
}

export async function createMachiningRequest(
  payload: MachiningRequestCreateInput,
): Promise<MachiningRequest> {
  const response = await apiClient.post<MachiningRequest>("/api/machining/requests", payload);
  return response.data;
}

export async function fetchMachiningProcesses(requestId: number): Promise<MachiningProcess[]> {
  const response = await apiClient.get<MachiningProcess[]>(
    `/api/machining/requests/${requestId}/processes`,
  );
  return response.data;
}

export async function createMachiningProcess(
  requestId: number,
  payload: MachiningProcessCreateInput,
): Promise<MachiningProcess> {
  const response = await apiClient.post<MachiningProcess>(
    `/api/machining/requests/${requestId}/processes`,
    payload,
  );
  return response.data;
}

export async function updateMachiningProcessStatus(
  processId: number,
  status: MachiningProcessStatus,
): Promise<MachiningProcess> {
  const response = await apiClient.patch<MachiningProcess>(
    `/api/machining/processes/${processId}/status`,
    { status },
  );
  return response.data;
}
