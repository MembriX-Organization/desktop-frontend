'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstitutionSelector() {
  const { institutions, currentInstitution, setCurrentInstitution } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Si solo hay 1 institución, mostrar de forma estática sin dropdown
  if (institutions.length === 1) {
    return (
      <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
        <div className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{institutions[0].name}</p>
      </div>
    );
  }

  // Si hay 0 instituciones, no mostrar nada
  if (institutions.length === 0) return null;

  const handleSelect = (inst: typeof institutions[0]) => {
    setCurrentInstitution(inst);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all group"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-sm font-semibold text-gray-800 truncate">
            {currentInstitution?.name ?? 'Seleccionar institución'}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform shrink-0 ml-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
              Tus instituciones
            </p>
            {institutions.map((inst) => {
              const isActive = currentInstitution?.id === inst.id;
              return (
                <button
                  key={inst.id}
                  onClick={() => handleSelect(inst)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)]/5'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-800'}`}>
                      {inst.name}
                    </p>
                    {inst.address && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{inst.address}</p>
                    )}
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
