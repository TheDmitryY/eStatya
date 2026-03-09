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
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: string | null;
  userId: string | null;
  login: (dto: LoginUserDTO) => Promise<void>;
  register: (dto: CreateUserDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUserId(me.user_id);
      setUserRole(me.role);
    } catch {
      setUserId(null);
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    fetchMe().finally(() => setIsLoading(false));
  }, [fetchMe]);

  const login = useCallback(
    async (dto: LoginUserDTO) => {
      await authApi.login(dto);
      await fetchMe();
    },
    [fetchMe],
  );

  const register = useCallback(
    async (dto: CreateUserDTO) => {
      await authApi.register(dto);
      // After registration the user is not auto-logged in via cookie,
      // so log them in immediately
      await authApi.login({ email: dto.email, password: dto.password });
      await fetchMe();
    },
    [fetchMe],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUserId(null);
    setUserRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userId,
        isLoading,
        isAdmin: userRole === 'admin',
        userRole,
        userId,
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
