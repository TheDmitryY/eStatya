import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/auth';
import { getUserPosts } from '../api/posts';
import type { Post } from '../types';
import { UserCircle, Shield, FileText, Calendar } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  role: string;
  username: string | null;
  avatar_url: string | null;
}

export function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    async function load() {
      setLoading(true);
      try {
        const p = await getProfile();
        setProfile(p);
        const userPosts = await getUserPosts(p.id);
        setPosts(userPosts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted">Please log in to view your profile.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl bg-error-bg text-error border border-error text-sm">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-text-muted mt-1">Your account details and posts</p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center gap-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
              <UserCircle size={32} className="text-accent" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              {profile.username ?? 'No username'}
            </h2>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-accent" />
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                  profile.role === 'admin'
                    ? 'bg-accent/15 text-accent'
                    : 'bg-accent-green/15 text-accent-green'
                }`}
              >
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <FileText size={18} className="text-accent" />
          Your Posts
          <span className="text-sm text-text-muted font-normal">
            ({posts.length})
          </span>
        </h2>

        {posts.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-text-muted">You haven't written any posts yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface border border-border rounded-xl p-5 hover:border-accent/40 transition-colors"
              >
                <h3 className="font-semibold text-base mb-1">{post.title}</h3>
                <p className="text-sm text-text-muted line-clamp-2 mb-3">
                  {post.body}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Calendar size={12} />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
