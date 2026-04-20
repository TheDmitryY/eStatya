import { useState, useEffect, useCallback } from 'react';
import { getUsers, getBannedUsers, banUser, unbanUser } from '../../api/admin';
import type { User } from '../../types';
import { Shield, ShieldOff, Search, Users, Ban as BanIcon, ChevronLeft, ChevronRight } from 'lucide-react';

type Tab = 'all' | 'banned';
const PAGE_SIZE = 20;

export function BansPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        tab === 'banned'
          ? await getBannedUsers(page * PAGE_SIZE, PAGE_SIZE + 1)
          : await getUsers(page * PAGE_SIZE, PAGE_SIZE + 1);
      setHasMore(data.length > PAGE_SIZE);
      setUsers(data.slice(0, PAGE_SIZE));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleBan(userId: string) {
    setActionLoading(userId);
    try {
      await banUser(userId);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ban failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnban(userId: string) {
    setActionLoading(userId);
    try {
      await unbanUser(userId);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unban failed');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.username ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bans Management</h1>
        <p className="text-text-muted mt-1">Manage user access and bans</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-error-bg text-error border border-error text-sm">
          {error}
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex bg-surface border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => { setTab('all'); setPage(0); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'all'
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Users size={16} />
            All Users
          </button>
          <button
            onClick={() => { setTab('banned'); setPage(0); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'banned'
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <BanIcon size={16} />
            Banned
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by email or username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder-text-muted/60 focus:border-accent focus:ring-0"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-text-muted font-medium">
                  User
                </th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">
                  Role
                </th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-text-muted"
                  >
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-5 py-3 font-medium">
                    {user.username ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-text-muted">{user.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                        user.role === 'banned'
                          ? 'bg-error/15 text-error'
                          : user.role === 'admin'
                            ? 'bg-accent/15 text-accent'
                            : 'bg-accent-green/15 text-accent-green'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {user.role === 'admin' ? null : user.role === 'banned' ? (
                      <button
                        onClick={() => handleUnban(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-green/15 text-accent-green hover:bg-accent-green/25 transition-colors disabled:opacity-50"
                      >
                        <ShieldOff size={14} />
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBan(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-error/15 text-error hover:bg-error/25 transition-colors disabled:opacity-50"
                      >
                        <Shield size={14} />
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">
            Page {page + 1} · Showing {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-surface border border-border hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-surface border border-border hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
