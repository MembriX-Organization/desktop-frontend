'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function InstitutionPromptCard() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  if (showForm) {
    return null; // El formulario se mostrará en su lugar
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-[var(--color-pampas)] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-12 text-center border border-[#B1ADA1]/20 relative overflow-hidden"
      >
        {/* Adorno decorativo de fondo corto */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-crail)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[var(--color-crail)]/5 rounded-full blur-3xl" />

        <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-white border border-[#B1ADA1]/20 rounded-3xl flex items-center justify-center shadow-lg">
          <Building2 className="w-10 h-10 text-[var(--color-crail)]" strokeWidth={1.5} />
        </div>

        <h1 className="relative z-10 text-4xl font-serif font-bold text-stone-900 mb-4 tracking-tight">
          ¡Hola, {user?.name?.split(' ')[0]}!
        </h1>
        
        <p className="relative z-10 text-lg text-stone-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Bienvenido al Panel de Control de Instituciones de <span className="font-serif font-semibold italic text-[var(--color-crail)]">MembriX</span>. 
          Para comenzar, necesitas registrar tu institución.
        </p>

        <div className="relative z-10 bg-white/60 backdrop-blur-sm border border-[#B1ADA1]/20 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-5">
            ¿Qué incluye el registro?
          </h2>
          <ul className="text-left text-stone-700 space-y-4 max-w-md mx-auto">
            {[
              'Gestión completa de miembros y socios',
              'Administración de planes y membresías',
              'Organización de eventos y actividades',
              'Panel de estadísticas en tiempo real'
            ].map((item, i) => (
              <li key={i} className="flex items-start group">
                <span className="inline-block w-1.5 h-1.5 bg-[var(--color-crail)] rounded-full mt-2.5 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/solicitar-alta" className="relative z-10 block">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-md mx-auto py-4 px-8 bg-[var(--color-crail)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-[#A95A4B] transition-all flex items-center justify-center group"
          >
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Inscribir mi institución
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        <p className="relative z-10 text-sm text-stone-500 mt-8 leading-relaxed max-w-md mx-auto">
          Una vez enviada tu solicitud, nuestro equipo la revisará 
          y te contactaremos pronto para completar el proceso.
        </p>
      </motion.div>
    </div>
  );
}
