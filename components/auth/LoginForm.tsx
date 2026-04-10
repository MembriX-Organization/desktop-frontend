'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockedUntil && Date.now() < lockedUntil) {
      const waitTime = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Demasiados intentos. Espera ${waitTime} segundos.`);
      return;
    } else if (lockedUntil && Date.now() >= lockedUntil) {
      setLockedUntil(null);
      setAttempts(0);
    }

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setLockedUntil(Date.now() + 30000);
          throw new Error('Cuenta temporalmente bloqueada por seguridad.');
        }
        throw new Error(data.message || 'Credenciales inválidas');
      }

      // Login automático redirige según el rol en AuthContext
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="w-full rounded-2xl relative overflow-hidden bg-white animate-in fade-in duration-500"
      style={{ 
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)' 
      }}
    >
      <div className="h-1 w-full bg-[var(--color-crail)]"></div>
      
      <div className="p-8 sm:p-10">
        <h2 
          className="text-2xl font-medium text-gray-900 mb-2 tracking-tight"
        >
          Iniciar sesión
        </h2>
        <p style={{ fontFamily: "'Lora', serif" }} className="text-sm mb-8 text-[var(--color-cloudy)]">
          Ingresa tus credenciales para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[var(--color-cloudy)]" />
              </div>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!lockedUntil}
                placeholder="correo@institucion.edu"
                className="block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-1 sm:text-sm transition-colors bg-white text-gray-900"
                style={{ 
                  borderColor: 'var(--color-cloudy)',
                  outlineColor: 'var(--color-crail)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-crail)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cloudy)'}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--color-cloudy)]" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!lockedUntil}
                placeholder="Contraseña"
                className="block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-1 sm:text-sm transition-colors bg-white text-gray-900"
                style={{ 
                  borderColor: 'var(--color-cloudy)',
                  outlineColor: 'var(--color-crail)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-crail)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cloudy)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || !!lockedUntil}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-cloudy)] hover:text-gray-600 outline-none transition-colors"
                style={{ zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded accent-[var(--color-crail)] bg-gray-100 border-none" />
                Recordarme
              </label>
              <Link replace href="/recovery" className="text-sm font-medium text-[var(--color-crail)] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-[var(--color-crail)] bg-orange-50 border border-orange-100 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!email || !password || isLoading || !!lockedUntil}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 bg-[var(--color-crail)]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continuar
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Footer de la tarjeta equivalente */}
      <div className="px-8 py-5 border-t border-[var(--color-cloudy)] border-opacity-20 bg-[var(--color-pampas)] bg-opacity-50 text-center flex flex-col items-center gap-1">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link replace href="/register" className="font-medium text-[var(--color-crail)] hover:underline">
            Solicitar acceso
          </Link>
        </p>
      </div>
    </div>
  );
}
