import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | MembriX Admin',
  description: 'Accede al panel de administración institucional de MembriX',
};

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'var(--color-pampas)' }}
    >
      <div className="w-full max-w-[900px] flex flex-col md:flex-row gap-8 items-center z-10">
        
        {/* Lado Izquierdo: Mensaje Editorial (Estilo Serif Anthropic) */}
        <div className="flex-1 text-center md:text-left space-y-6 md:pr-8">
          <h1 
            style={{ 
              fontFamily: "'Lora', Georgia, serif", 
              letterSpacing: '-0.03em', 
              lineHeight: '1.15' 
            }}
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-medium"
          >
            Gestión <br/>
            <span className="italic text-[var(--color-crail)]">de instituciones.</span>
          </h1>
          
          <p 
            style={{ 
              fontFamily: "'Lora', Georgia, serif", 
              lineHeight: '1.7' 
            }}
            className="text-lg text-gray-700 max-w-md mx-auto md:mx-0"
          >
            Accede al panel central de administración. Diseñado para simplificar la gestión de tu institución y automatizar la suscripción de miembros de forma clara y centralizada.
          </p>
        </div>

        {/* Lado Derecho: Flujo de Autenticación */}
        <div className="w-full max-w-md relative">
          <LoginForm />
        </div>
      </div>
      
      {/* Background Decorativo sútil (opcional, acorde al estilo limpio) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-crail)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-cloudy)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
    </div>
  );
}
