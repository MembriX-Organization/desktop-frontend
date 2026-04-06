'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
  role?: string; // Añadido para detectar rol
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token on initial load
    const storedToken = Cookies.get('membrix_token');
    const storedUser = localStorage.getItem('membrix_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    // Almacenamos el token en cookies para mejor uso con rutas
    Cookies.set('membrix_token', newToken, { expires: 7 }); // expira en 7 días
    localStorage.setItem('membrix_user', JSON.stringify(newUser));

    // Redirigir según el rol del usuario
    // Si el usuario es 'institution' o 'admin', va al dashboard institucional
    // De lo contrario, va al dashboard normal de socio
    if (newUser.role === 'institution' || newUser.role === 'admin') {
      router.replace('/dashboard');
    } else {
      router.replace('/dashboard'); // Por ahora ambos van al mismo, se puede ajustar luego
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('membrix_token');
    localStorage.removeItem('membrix_user');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
