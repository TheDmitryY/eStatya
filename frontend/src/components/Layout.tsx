import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text-primary md:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 md:ml-60 p-8 pt-16 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
