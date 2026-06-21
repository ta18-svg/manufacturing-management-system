import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { STATUS_LABELS } from "./constants";
import {
  createMachiningProcess,
  fetchMachiningProcesses,
  fetchMachiningRequest,
  updateMachiningProcessStatus,
} from "./machiningApi";
import type { MachiningProcess, MachiningProcessStatus, MachiningRequest } from "./types";

export function MachiningRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [request, setRequest] = useState<MachiningRequest | null>(null);
  const [processes, setProcesses] = useState<MachiningProcess[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processNo, setProcessNo] = useState("");
  const [processName, setProcessName] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageProcess = user?.role.name === "admin" || user?.role.name === "leader";
  const canUpdateStatus = canManageProcess || user?.role.name === "worker";

  const requestId = id ? Number(id) : null;

  useEffect(() => {
    if (!requestId) {
      return;
    }
    fetchMachiningRequest(requestId)
      .then(setRequest)
      .catch(() => setError("加工依頼が見つかりませんでした"));
    fetchMachiningProcesses(requestId)
      .then(setProcesses)
      .catch(() => setProcessError("工程一覧の取得に失敗しました"));
  }, [requestId]);

  const handleStatusChange = async (process: MachiningProcess, status: MachiningProcessStatus) => {
    try {
      const updated = await updateMachiningProcessStatus(process.id, status);
      setProcesses((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      setProcessError("工程ステータスの更新に失敗しました");
    }
  };

  const handleAddProcess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessError(null);

    if (!requestId) {
      return;
    }
    const parsedProcessNo = Number(processNo);
    if (!Number.isInteger(parsedProcessNo) || parsedProcessNo <= 0 || !processName.trim()) {
      setProcessError("工程番号と工程名を正しく入力してください");
      return;
    }
    const parsedOperatorId = operatorId.trim() ? Number(operatorId) : null;
    if (parsedOperatorId !== null && (!Number.isInteger(parsedOperatorId) || parsedOperatorId <= 0)) {
      setProcessError("担当者IDは1以上の整数を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createMachiningProcess(requestId, {
        process_no: parsedProcessNo,
        process_name: processName.trim(),
        operator_id: parsedOperatorId,
      });
      setProcesses((current) => [...current, created].sort((a, b) => a.process_no - b.process_no));
      setProcessNo("");
      setProcessName("");
      setOperatorId("");
    } catch {
      setProcessError("工程の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <p className="login-error">{error}</p>;
  }
  if (!request) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>加工依頼詳細</h1>
      <dl className="detail-list">
        <dt>依頼番号</dt>
        <dd>{request.request_no}</dd>
        <dt>品番</dt>
        <dd>{request.product_code}</dd>
        <dt>品名</dt>
        <dd>{request.product_name}</dd>
        <dt>数量</dt>
        <dd>{request.quantity}</dd>
        <dt>納期</dt>
        <dd>{new Date(request.due_date).toLocaleDateString("ja-JP")}</dd>
        <dt>進捗</dt>
        <dd>{STATUS_LABELS[request.status]}</dd>
        <dt>登録者</dt>
        <dd>{request.created_by.name}</dd>
      </dl>

      <h2>工程管理</h2>
      {processError && <p className="login-error">{processError}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>工程番号</th>
            <th>工程名</th>
            <th>担当者</th>
            <th>進捗</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.process_no}</td>
              <td>{process.process_name}</td>
              <td>{process.operator?.name ?? "-"}</td>
              <td>
                {canUpdateStatus ? (
                  <select
                    value={process.status}
                    onChange={(event) =>
                      handleStatusChange(process, event.target.value as MachiningProcessStatus)
                    }
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  STATUS_LABELS[process.status]
                )}
              </td>
            </tr>
          ))}
          {processes.length === 0 && (
            <tr>
              <td colSpan={4}>工程が登録されていません</td>
            </tr>
          )}
        </tbody>
      </table>

      {canManageProcess && (
        <form className="entity-form" onSubmit={handleAddProcess}>
          <label>
            工程番号
            <input
              type="number"
              min={1}
              value={processNo}
              onChange={(event) => setProcessNo(event.target.value)}
              required
            />
          </label>
          <label>
            工程名
            <input
              value={processName}
              onChange={(event) => setProcessName(event.target.value)}
              required
            />
          </label>
          <label>
            担当者ID（任意）
            <input
              type="number"
              min={1}
              value={operatorId}
              onChange={(event) => setOperatorId(event.target.value)}
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "登録中..." : "工程を追加"}
          </button>
        </form>
      )}
    </div>
  );
}
