import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User, LoginDto, RegisterDto } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (loginData: LoginDto) => Promise<void>;
  register: (registerData: RegisterDto) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session from server via cookie
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginData: LoginDto) => {
    setLoading(true);
    try {
      const response = await authApi.login(loginData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterDto) => {
    setLoading(true);
    try {
      const response = await authApi.register(registerData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



