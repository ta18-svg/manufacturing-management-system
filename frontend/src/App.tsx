import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./app/HomePage";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./features/auth/LoginPage";
import { MachiningRequestCreatePage } from "./features/machining/MachiningRequestCreatePage";
import { MachiningRequestDetailPage } from "./features/machining/MachiningRequestDetailPage";
import { MachiningRequestListPage } from "./features/machining/MachiningRequestListPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/machining/requests" element={<MachiningRequestListPage />} />
          <Route path="/machining/requests/new" element={<MachiningRequestCreatePage />} />
          <Route path="/machining/requests/:id" element={<MachiningRequestDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
