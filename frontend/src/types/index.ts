export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface AuthResult {
  access_token: string;
  token_type: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ApiError {
  detail: string;
}
