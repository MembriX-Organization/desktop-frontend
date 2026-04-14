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
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-12 text-center border border-[#B1ADA1]/20"
      >
        <div className="w-24 h-24 mx-auto mb-8 bg-[var(--color-crail)] rounded-3xl flex items-center justify-center shadow-xl">
          <Building2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¡Hola, {user?.name?.split(' ')[0]}!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          Bienvenido al Panel de Control de Instituciones de MembriX. 
          Para comenzar, necesitas registrar tu institución.
        </p>

        <div className="bg-[var(--color-pampas)] rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            ¿Qué incluye el registro?
          </h2>
          <ul className="text-left text-gray-700 space-y-3 max-w-md mx-auto">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Gestión completa de miembros y socios</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Administración de planes y membresías</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Organización de eventos y actividades</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Panel de estadísticas en tiempo real</span>
            </li>
          </ul>
        </div>

        <Link href="/solicitar-alta">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-md mx-auto py-5 px-8 bg-[var(--color-crail)] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-[var(--color-crail-dark)] transition-all flex items-center justify-center group"
          >
            <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Inscribir mi institución
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        <p className="text-sm text-gray-500 mt-8">
          Una vez enviada tu solicitud, nuestro equipo la revisará 
          y te contactaremos pronto para completar el proceso.
        </p>
      </motion.div>
    </div>
  );
}
