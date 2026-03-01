import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { getPosts } from '../api/posts';
import type { Post } from '../types';

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Technical Articles & Knowledge Sharing</h1>
        <p>Discover insights from the developer community</p>
      </section>

      {loading && <p className="center-text">Loading posts…</p>}

      {error && <p className="error-text">Failed to load posts: {error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="center-text muted">No posts yet. Be the first to write!</p>
      )}

      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
