import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import WaveBackground from '@/components/ui/WaveBackground';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta | MembriX Admin',
  description: 'Regístrate en el panel de administración institucional de MembriX',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-6 relative overflow-hidden z-0">
      <WaveBackground />
      
      {/* Círculos decorativos de fondo animados (Blobs) */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

      <RegisterForm />
    </div>
  );
}
