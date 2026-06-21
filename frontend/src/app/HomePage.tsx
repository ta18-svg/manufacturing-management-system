import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const ROLE_LABELS: Record<string, string> = {
  admin: "管理者",
  leader: "現場リーダー",
  worker: "作業者",
  viewer: "閲覧者",
};

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>加工管理システム</h1>
      <p>ログインユーザー: {user?.name}</p>
      <p>権限: {user ? ROLE_LABELS[user.role.name] ?? user.role.name : ""}</p>
      <p>
        <Link to="/machining/requests">加工依頼一覧を見る</Link>
      </p>
    </div>
  );
}
