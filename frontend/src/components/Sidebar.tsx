import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  Ban,
  CalendarClock,
  LogOut,
  LogIn,
  UserPlus,
  UserCircle,
  X,
} from 'lucide-react';

const linkBase =
  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors';
const linkActive = 'bg-accent/15 text-accent';
const linkInactive = 'text-text-muted hover:text-text-primary hover:bg-surface-hover';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Auto-close on route change (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-60 bg-surface border-r border-border flex flex-col z-50 transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Logo + Close */}
      <div className="px-5 py-5 border-b border-border flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-text-primary">
          <span className="text-2xl">📝</span>
          <span>eStatya</span>
        </NavLink>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </NavLink>
        )}

        {isAdmin && (
          <>
            <div className="px-4 pt-5 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Admin
              </span>
            </div>

            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/bans"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Ban size={18} />
              <span>Bans</span>
            </NavLink>

            <NavLink
              to="/admin/schedule"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <CalendarClock size={18} />
              <span>Schedule</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className={`${linkBase} ${linkInactive} w-full`}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}
