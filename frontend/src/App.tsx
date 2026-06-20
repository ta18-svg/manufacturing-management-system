import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./app/HomePage";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { LoginPage } from "./features/auth/LoginPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
