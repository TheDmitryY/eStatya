import { apiRequest } from './client';
import type { Post } from '../types';

export async function getPosts(skip = 0, limit = 20): Promise<Post[]> {
  return apiRequest<Post[]>(`/posts?skip=${skip}&limit=${limit}`);
}

export async function getPost(id: number): Promise<Post> {
  return apiRequest<Post>(`/posts/${id}`);
}

export async function createPost(data: {
  title: string;
  body: string;
}): Promise<Post> {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserPosts(userId: string, skip = 0, limit = 20): Promise<Post[]> {
  return apiRequest<Post[]>(`/users/${userId}/posts?skip=${skip}&limit=${limit}`);
}
