import { apiRequest } from './client';
import type { AuthResult, CreateUserDTO, LoginUserDTO } from '../types';

export async function register(dto: CreateUserDTO): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function login(dto: LoginUserDTO): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}
