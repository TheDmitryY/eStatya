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
    <article className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 transition-colors hover:bg-surface-hover hover:border-accent cursor-pointer">
      <h2 className="text-base font-semibold leading-tight text-text-primary">
        {post.title}
      </h2>
      <p className="text-sm text-text-muted flex-1">{preview}</p>
      <div className="flex justify-between text-xs text-text-muted border-t border-border pt-3">
        <span className="font-medium text-accent">
          {post.author?.username ?? 'Anonymous'}
        </span>
        <time>{date}</time>
      </div>
    </article>
  );
}
