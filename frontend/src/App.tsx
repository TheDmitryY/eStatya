import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AdminRoute } from './components/AdminRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { BansPage } from './pages/admin/BansPage';
import { SchedulePage } from './pages/admin/SchedulePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bans"
              element={
                <AdminRoute>
                  <BansPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schedule"
              element={
                <AdminRoute>
                  <SchedulePage />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
