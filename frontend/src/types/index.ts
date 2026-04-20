export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
  avatar_url?: string | null;
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

export interface PrometheusResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      value?: [number, string];
      values?: Array<[number, string]>;
    }>;
  };
}

export interface LokiStream {
  stream: Record<string, string>;
  values: Array<[string, string]>;
}

export interface LokiResult {
  status: string;
  data: {
    resultType: string;
    result: LokiStream[];
  };
}

