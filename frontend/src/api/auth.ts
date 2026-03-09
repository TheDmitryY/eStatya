import { apiRequest } from './client';
import type { CreateUserDTO, LoginUserDTO } from '../types';

interface RegisterResult {
  id: string;
  email: string;
  role: string;
  username: string | null;
}

export async function register(dto: CreateUserDTO): Promise<RegisterResult> {
  return apiRequest<RegisterResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function login(dto: LoginUserDTO): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<{ user_id: string; role: string }> {
  return apiRequest<{ user_id: string; role: string }>('/auth/me');
}

export async function getProfile(): Promise<{
  id: string;
  email: string;
  role: string;
  username: string | null;
  avatar_url: string | null;
}> {
  return apiRequest('/users/me');
}
