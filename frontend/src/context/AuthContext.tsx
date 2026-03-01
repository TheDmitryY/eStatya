import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth';
import type { CreateUserDTO, LoginUserDTO } from '../types';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginUserDTO) => Promise<void>;
  register: (dto: CreateUserDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('access_token');
    if (saved) setToken(saved);
    setIsLoading(false);
  }, []);

  const saveToken = useCallback((accessToken: string) => {
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);
  }, []);

  const login = useCallback(
    async (dto: LoginUserDTO) => {
      const result = await authApi.login(dto);
      saveToken(result.access_token);
    },
    [saveToken],
  );

  const register = useCallback(
    async (dto: CreateUserDTO) => {
      const result = await authApi.register(dto);
      saveToken(result.access_token);
    },
    [saveToken],
  );

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    localStorage.removeItem('access_token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
