import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <nav className="app-nav">
          <Link to="/">ホーム</Link>
          <Link to="/machining/requests">加工依頼一覧</Link>
        </nav>
        <div className="app-header-user">
          <span>{user?.name}</span>
          <button onClick={() => logout()}>ログアウト</button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
