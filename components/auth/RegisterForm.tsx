'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const registerSchema = z
  .object({
    name: z.string().min(2, 'Al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Al menos una letra mayúscula')
      .regex(/[0-9]/, 'Al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
  return score;
};

export default function RegisterForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration States
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // Triggers OTP Screen

  // OTP Verification States
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchPassword = watch('password', '');
  const watchEmail = watch('email');
  const strengthScore = getPasswordStrength(watchPassword);

  const strengthLabels = ['Muy Débil', 'Débil', 'Media', 'Fuerte', 'Muy Fuerte'];
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-orange-400', 'bg-green-500', 'bg-emerald-600'];

  const getInputStyles = (fieldName: keyof RegisterFormValues) => {
    const isTouched = touchedFields[fieldName];
    const hasError = !!errors[fieldName];

    return cn(
      'w-full px-5 py-4 pl-12 border-none bg-gray-50/50 rounded-2xl outline-none transition-all text-slate-900',
      !isTouched && 'focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white',
      isTouched && hasError && 'ring-2 ring-red-400 focus:ring-red-500 bg-red-50/30 text-slate-900 placeholder:text-red-300',
      isTouched && !hasError && 'ring-2 ring-green-400 focus:ring-green-500 bg-green-50/20 text-slate-900 focus:bg-white',
      isSubmitting && 'opacity-50 cursor-not-allowed'
    );
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    setIsSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('El correo ya se encuentra registrado.');
        }
        throw new Error(responseData.message || 'Error desconocido al registrar usuario.');
      }

      // Despliega el OTP form
      setIsSuccess(true);
    } catch (err: any) {
      setApiError(err.message || 'Error de conexión');
    }
  };

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setIsVerifying(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: watchEmail, code: verifyCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Código incorrecto. Revisa tu email.');
      }

      // Auto-Logean al usuario dentro de la plataforma principal
      login(data.access_token, data.user);

    } catch (err: any) {
      setVerifyError(err.message || 'Error al verificar la cuenta');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 relative z-10 border border-white my-4 text-slate-900"
    >

      {/* 🔴 PANTALLA 2: VERIFICACIÓN OTP */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pb-2"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <Mail size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Revisa tu correo</h3>
            <p className="text-sm text-gray-500 mt-3 px-4">
              Hemos enviado un código seguro de 6 dígitos a la dirección <strong>{watchEmail}</strong>.
            </p>
          </div>

          <form onSubmit={onVerifySubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                disabled={isVerifying}
                placeholder="A5Z9P2"
                className="w-full px-5 py-5 border-none bg-gray-50/50 rounded-2xl outline-none transition-all text-slate-900 text-center text-3xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white uppercase placeholder:tracking-normal placeholder:font-sans placeholder:text-lg"
              />
            </div>

            {verifyError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center font-medium">
                {verifyError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || verifyCode.length < 5}
              className="mt-6 w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-lg text-center shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all outline-none disabled:opacity-50 disabled:hover:translate-y-0 uppercase tracking-widest"
            >
              {isVerifying ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Verificar'}
            </button>
          </form>
        </motion.div>
      )}

      {/* 🔵 PANTALLA 1: REGISTRO STANDARD */}
      {!isSuccess && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Crea tu Cuenta
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Comienza ingresando tus datos principales
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                {...register('name')}
                disabled={isSubmitting}
                className={getInputStyles('name')}
                placeholder="Juan Pérez"
              />
              {errors.name && <p className="text-[11px] font-bold uppercase text-red-500 ml-4 mt-1">{errors.name.message}</p>}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                disabled={isSubmitting}
                className={getInputStyles('email')}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-[11px] font-bold uppercase text-red-500 ml-4 mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-[22px] -translate-y-[50%] text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  disabled={isSubmitting}
                  className={cn(getInputStyles('password'), 'pr-12')}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-4 top-[22px] -translate-y-[50%] text-slate-400 hover:text-slate-600 outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-bold uppercase text-red-500 ml-4 mt-1">{errors.password.message}</p>}

              {watchPassword.length > 0 && (
                <div className="ml-2 mr-2 pt-1 pb-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Fortaleza</p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest", strengthScore >= Math.floor((strengthLabels.length - 1) / 2) ? "text-emerald-600" : "text-gray-500")}>
                      {strengthLabels[strengthScore]}
                    </p>
                  </div>
                  <div className="flex h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-300", strengthColors[strengthScore])}
                      style={{ width: `${(Math.max(strengthScore, 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-[22px] -translate-y-[50%] text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                disabled={isSubmitting}
                className={cn(getInputStyles('confirmPassword'), 'pr-12')}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-4 top-[22px] -translate-y-[50%] text-slate-400 hover:text-slate-600 outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && <p className="text-[11px] font-bold uppercase text-red-500 ml-4 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {apiError && (
              <div className="p-3 mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center font-medium">
                {apiError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Creando cuenta...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6 pb-2">
              ¿Ya tienes cuenta?{' '}
              <Link
                replace
                href="/login"
                className="font-bold text-[var(--color-primary)] hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
        </>
      )}
    </motion.div>
  );
}