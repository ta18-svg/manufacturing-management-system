import type { MachiningRequestStatus } from "./types";

export const STATUS_LABELS: Record<MachiningRequestStatus, string> = {
  not_started: "未着手",
  in_progress: "加工中",
  completed: "完了",
  on_hold: "保留",
};
