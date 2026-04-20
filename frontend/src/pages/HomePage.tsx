import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { getPosts } from '../api/posts';
import type { Post } from '../types';
import { Search } from 'lucide-react';

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text-primary to-accent bg-clip-text text-transparent">
          Technical Articles & Knowledge Sharing
        </h1>
        <p className="mt-2 text-text-muted text-lg">
          Discover insights from the developer community
        </p>
      </section>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-text-muted/60 focus:border-accent focus:ring-0"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
        </div>
      )}

      {error && (
        <p className="text-center text-error py-8">
          Failed to load posts: {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">
          {search ? 'No posts match your search.' : 'No posts yet. Be the first to write!'}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
