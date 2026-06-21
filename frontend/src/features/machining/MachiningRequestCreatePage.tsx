import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createMachiningRequest } from "./machiningApi";

export function MachiningRequestCreatePage() {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsedQuantity = Number(quantity);
    if (!productCode.trim() || !productName.trim() || !dueDate) {
      setError("すべての項目を入力してください");
      return;
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError("数量は1以上の整数を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createMachiningRequest({
        product_code: productCode.trim(),
        product_name: productName.trim(),
        quantity: parsedQuantity,
        due_date: dueDate,
      });
      navigate(`/machining/requests/${created.id}`, { replace: true });
    } catch {
      setError("加工依頼の登録に失敗しました。権限を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>加工依頼登録</h1>
      <form className="entity-form" onSubmit={handleSubmit}>
        <label>
          品番
          <input
            value={productCode}
            onChange={(event) => setProductCode(event.target.value)}
            required
          />
        </label>
        <label>
          品名
          <input
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            required
          />
        </label>
        <label>
          数量
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>
        <label>
          納期
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
