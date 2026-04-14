'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
  role?: string;
}

export interface Institution {
  id: number;
  name: string;
  address?: string | null;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  institutions: Institution[];
  currentInstitution: Institution | null;
  setCurrentInstitution: (inst: Institution) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [currentInstitution, setCurrentInstitutionState] = useState<Institution | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  // Cargar instituciones cuando hay token
  useEffect(() => {
    if (!token) return;

    const fetchInstitutions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/institutions/my-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data: Institution[] = await res.json();
        setInstitutions(data);

        // Restaurar la última institución seleccionada o usar la primera
        const stored = localStorage.getItem('membrix_current_institution');
        if (stored) {
          try {
            const parsed: Institution = JSON.parse(stored);
            const found = data.find((i) => i.id === parsed.id);
            setCurrentInstitutionState(found ?? data[0] ?? null);
          } catch {
            setCurrentInstitutionState(data[0] ?? null);
          }
        } else {
          setCurrentInstitutionState(data[0] ?? null);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchInstitutions();
  }, [token]);

  const setCurrentInstitution = (inst: Institution) => {
    setCurrentInstitutionState(inst);
    localStorage.setItem('membrix_current_institution', JSON.stringify(inst));
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set('membrix_token', newToken, { expires: 7 });
    localStorage.setItem('membrix_user', JSON.stringify(newUser));
    router.replace('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setInstitutions([]);
    setCurrentInstitutionState(null);
    Cookies.remove('membrix_token');
    localStorage.removeItem('membrix_user');
    localStorage.removeItem('membrix_current_institution');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        institutions,
        currentInstitution,
        setCurrentInstitution,
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
