import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const preview =
    post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body;

  return (
    <article className="post-card">
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-card-body">{preview}</p>
      <div className="post-card-meta">
        <span className="post-card-author">
          {post.author?.username ?? 'Anonymous'}
        </span>
        <time className="post-card-date">{date}</time>
      </div>
    </article>
  );
}
