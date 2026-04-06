'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 relative z-10 border border-white"
    >
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)] rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-900/20 overflow-hidden p-2">
           <span className="text-5xl font-serif text-white font-bold italic">M</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido</h1>
        <p className="text-gray-500 mt-2 text-sm">Ingresa a tu cuenta de Miembrix</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || !!lockedUntil}
            placeholder="hola@ejemplo.com"
            className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none disabled:opacity-50 text-slate-900"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || !!lockedUntil}
            placeholder="••••••••"
            className="w-full px-5 py-4 pl-12 pr-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none disabled:opacity-50 text-slate-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || !!lockedUntil}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between px-2 pt-2 pb-4">
          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="mr-2 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-gray-100 border-none" />
            Recordarme
          </label>
          <Link replace href="/recovery" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || !!lockedUntil}
          className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:opacity-70 mt-4"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        ¿No tienes una cuenta?{' '}
        <Link replace href="/register" className="font-bold text-[var(--color-primary)] hover:underline">
          Regístrate
        </Link>
      </p>
    </motion.div>
  );
}
