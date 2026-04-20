import { apiRequest } from './client';
import type { User } from '../types';

export async function getUsers(skip = 0, limit = 20): Promise<User[]> {
  return apiRequest<User[]>(`/admins/users?skip=${skip}&limit=${limit}`);
}

export async function getUserById(userId: string): Promise<User> {
  return apiRequest<User>(`/admins/users/${userId}`);
}

export async function banUser(userId: string): Promise<User> {
  return apiRequest<User>(`/admins/bans?user_id=${userId}`, {
    method: 'POST',
  });
}

export async function unbanUser(userId: string): Promise<User> {
  return apiRequest<User>(`/admins/unbans?user_id=${userId}`, {
    method: 'DELETE',
  });
}

export async function getBannedUsers(skip = 0, limit = 20): Promise<User[]> {
  return apiRequest<User[]>(`/admins/bans?skip=${skip}&limit=${limit}`);
}

export async function getBannedUser(userId: string): Promise<User> {
  return apiRequest<User>(`/admins/bans/${userId}`);
}

export async function banUserByEmail(email: string): Promise<User> {
  return apiRequest<User>(`/admins/bans/email?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });
}
