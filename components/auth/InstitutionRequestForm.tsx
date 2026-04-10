'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Phone, Users, MapPin, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import WaveBackground from '@/components/ui/WaveBackground';

// Schema de validación con Zod
const institutionRequestSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  type: z.string().min(3, 'El tipo de institución es obligatorio'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  estimatedMembers: z.number().min(1, 'Debe tener al menos 1 miembro'),
  address: z.string().optional(),
});

type InstitutionRequestFormData = z.infer<typeof institutionRequestSchema>;

export default function InstitutionRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InstitutionRequestFormData>({
    resolver: zodResolver(institutionRequestSchema),
  });

  const onSubmit = async (data: InstitutionRequestFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // Obtener token si existe (usuario autenticado)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('membrix_token='))
        ?.split('=')[1];

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Asegurar que estimatedMembers sea número
      const payload = {
        ...data,
        estimatedMembers: Number(data.estimatedMembers),
      };

      const res = await fetch(`${apiUrl}/api/institutions/request-creation`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Error al enviar la solicitud');
      }

      setSuccessMessage('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden z-0">
      <WaveBackground />
      
      {/* Círculos decorativos de fondo animados (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-pantano-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 relative z-10 border border-white"
      >
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)] rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-900/20 overflow-hidden p-2">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Solicitar Alta de Institución</h1>
          <p className="text-gray-500 mt-2 text-sm">Completa el formulario para que tu institución forme parte de MembriX</p>
        </div>

        {successMessage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Ir al panel
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nombre de la institución */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Institución *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  {...register('name')}
                  placeholder="Ej: Club Deportivo Los Pinos"
                  className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none text-slate-900"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Tipo de institución */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Institución *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  {...register('type')}
                  className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none text-slate-900 appearance-none"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Club Deportivo">Club Deportivo</option>
                  <option value="Gimnasio">Gimnasio</option>
                  <option value="Instituto Educativo">Instituto Educativo</option>
                  <option value="Centro Cultural">Centro Cultural</option>
                  <option value="Asociación">Asociación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Contacto *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="tel"
                    {...register('phone')}
                    placeholder="+54 11 1234-5678"
                    className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none text-slate-900"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Miembros estimados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miembros Estimados *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="number"
                    {...register('estimatedMembers', { valueAsNumber: true })}
                    placeholder="100"
                    min="1"
                    className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none text-slate-900"
                  />
                </div>
                {errors.estimatedMembers && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedMembers.message}</p>
                )}
              </div>
            </div>

            {/* Dirección (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección (Opcional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  {...register('address')}
                  placeholder="Calle Principal 123, Ciudad"
                  className="w-full px-5 py-4 pl-12 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all outline-none text-slate-900"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:opacity-70 mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                'Enviar Solicitud'
              )}
            </button>
          </form>
        )}
      
      </motion.div>
    </div>
  );
}
