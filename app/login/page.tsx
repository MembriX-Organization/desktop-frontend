import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import WaveBackground from '@/components/ui/WaveBackground';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | MembriX Admin',
  description: 'Accede al panel de administración institucional de MembriX',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden z-0">
      <WaveBackground />
      
      {/* Círculos decorativos de fondo animados (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-pantano-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

      <LoginForm />
    </div>
  );
}
