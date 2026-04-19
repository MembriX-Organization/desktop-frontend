'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Loader2, Search, UserCheck, Users } from 'lucide-react';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

const schema = z.object({
  fullName: z.string().min(2, 'El nombre es obligatorio'),
  dni: z.string().min(6, 'DNI inválido'),
  membershipDataId: z.string().min(1, 'Seleccioná un plan'),
});

type FormValues = z.infer<typeof schema>;

interface UserSearchResult {
  id: string;
  email: string;
  name: string;
}

export interface MemberEnrolled {
  id: string;
  role: string;
  userId: string;
  dni: string;
  fullName: string;
  status: string;
  user: { id: string; email: string; name: string };
  membershipData: { id: string; membershipType: string; price: string };
}

interface Plan {
  id: string;
  membershipType: string;
  price: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  institutionId: string;
  plans: Plan[];
  token: string | null;
  onSuccess: (newMember: MemberEnrolled) => void;
}

const inputBase =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--color-crail)]/30 focus:border-[var(--color-crail)] focus:bg-white placeholder:text-gray-400';
const errorInput = 'ring-2 ring-red-300 border-red-300 bg-red-50/30';

export default function AltaSocioModal({ isOpen, onClose, institutionId, plans, token, onSuccess }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', dni: '', membershipDataId: '' },
  });

  // Reset completo al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
      reset({ fullName: '', dni: '', membershipDataId: '' });
    }
  }, [isOpen, reset]);

  // Escape para cerrar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSubmitting, onClose]);

  // Búsqueda debounced (350ms)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `${API_URL}/api/institutions/${institutionId}/users/search?q=${encodeURIComponent(searchQuery.trim())}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) setSearchResults(await res.json());
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchQuery, institutionId, token]);

  const handleSelectUser = useCallback(
    (user: UserSearchResult) => {
      setSelectedUser(user);
      setSearchQuery('');
      setSearchResults([]);
      setValue('fullName', user.name, { shouldValidate: false });
    },
    [setValue],
  );

  const handleDeselect = useCallback(() => {
    setSelectedUser(null);
    reset({ fullName: '', dni: '', membershipDataId: '' });
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `${API_URL}/api/institutions/${institutionId}/memberships/manual-enroll`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: selectedUser.email,
            fullName: data.fullName.trim(),
            dni: data.dni.trim(),
            membershipDataId: Number(data.membershipDataId),
          }),
        },
      );

      if (res.status === 409) {
        setError('root', { message: 'Este usuario ya es miembro de la institución' });
        return;
      }

      const body = await res.json().catch(() => ({})) as { message?: string };

      if (!res.ok) {
        setError('root', { message: body.message ?? 'Ocurrió un error, intentá de nuevo' });
        return;
      }

      onSuccess(body as unknown as MemberEnrolled);
    } catch {
      setError('root', { message: 'No se pudo conectar con el servidor' });
    }
  };

  const formDisabled = !selectedUser;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isSubmitting && onClose()}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--color-crail)] rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Alta de Socio</h2>
                    <p className="text-xs text-gray-500">Buscá el usuario y completá los datos del alta</p>
                  </div>
                </div>
                <button
                  onClick={() => !isSubmitting && onClose()}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: dos columnas */}
              <div className="grid grid-cols-[1fr_1px_1fr] min-h-[420px]">

                {/* Panel izquierdo — Buscador */}
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Buscar socio
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                      )}
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nombre o email..."
                        disabled={isSubmitting}
                        className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--color-crail)]/30 focus:border-[var(--color-crail)] focus:bg-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="flex-1 overflow-y-auto max-h-64 space-y-1.5">
                    {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Users className="w-8 h-8 mb-2 opacity-40" />
                        <p className="text-sm">Sin resultados</p>
                        <p className="text-xs mt-0.5 text-center">El usuario no existe o ya es miembro</p>
                      </div>
                    )}
                    {searchQuery.trim().length < 2 && !selectedUser && (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                        <Search className="w-8 h-8 mb-2 opacity-40" />
                        <p className="text-sm">Escribí 2 o más caracteres</p>
                      </div>
                    )}
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full text-left px-3.5 py-3 rounded-xl border border-gray-100 hover:border-[var(--color-crail)]/40 hover:bg-orange-50/40 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-pampas)] flex items-center justify-center text-[var(--color-crail)] font-bold text-sm shrink-0 border border-[#B1ADA1]/20">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[var(--color-crail)] transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* Usuario seleccionado (confirmación) */}
                    {selectedUser && searchResults.length === 0 && searchQuery.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                          <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{selectedUser.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedUser.email}</p>
                        <button
                          type="button"
                          onClick={handleDeselect}
                          className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
                        >
                          Cambiar usuario
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divisor vertical */}
                <div className="bg-gray-100" />

                {/* Panel derecho — Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Datos del alta
                  </p>

                  {/* Estado: sin usuario seleccionado */}
                  {!selectedUser && (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-300">
                      <UserPlus className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium text-gray-400">Seleccioná un socio</p>
                      <p className="text-xs text-gray-300 mt-1">para completar el formulario</p>
                    </div>
                  )}

                  {/* Formulario (visible solo cuando hay usuario seleccionado) */}
                  {selectedUser && (
                    <>
                      {/* Email (solo lectura) */}
                      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                        <UserCheck className="w-4 h-4 text-green-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-green-700 font-medium truncate">{selectedUser.email}</p>
                        </div>
                      </div>

                      {/* Nombre completo */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register('fullName')}
                          disabled={isSubmitting}
                          placeholder="Ej: Juan Pérez"
                          className={`${inputBase} ${errors.fullName ? errorInput : ''}`}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>
                        )}
                      </div>

                      {/* DNI */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          DNI <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register('dni')}
                          disabled={isSubmitting}
                          placeholder="Ej: 40123456"
                          className={`${inputBase} ${errors.dni ? errorInput : ''}`}
                        />
                        {errors.dni && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.dni.message}</p>
                        )}
                      </div>

                      {/* Plan */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Plan de membresía <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register('membershipDataId')}
                          disabled={isSubmitting || plans.length === 0}
                          className={`${inputBase} ${errors.membershipDataId ? errorInput : ''}`}
                        >
                          <option value="">Seleccioná un plan</option>
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.membershipType} — ${Number(p.price).toLocaleString('es-AR')}
                            </option>
                          ))}
                        </select>
                        {plans.length === 0 && (
                          <p className="text-xs text-amber-500 mt-1">No hay planes activos disponibles</p>
                        )}
                        {errors.membershipDataId && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.membershipDataId.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {errors.root && (
                    <p className="text-sm text-red-500 font-medium text-center">{errors.root.message}</p>
                  )}

                  <div className="mt-auto pt-2">
                    <button
                      type="submit"
                      disabled={formDisabled || isSubmitting || plans.length === 0}
                      className="w-full py-3.5 bg-[var(--color-crail)] text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Inscribir socio
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
