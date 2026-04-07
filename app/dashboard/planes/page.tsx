'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Pencil,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MembershipPlan {
  id: number;
  membershipType: string;
  price: number;
  durationInMonths: number;
  paymentGraceDays: number;
  description: string | null;
  benefits: string | null;
  isActive: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const planSchema = z.object({
  membershipType: z.string().min(1, 'El nombre del plan es obligatorio'),
  price: z
    .number({ error: 'El precio es obligatorio' })
    .min(0, 'El precio no puede ser negativo'),
  durationInMonths: z
    .number({ error: 'Ingresa la duración en meses' })
    .min(1, 'Mínimo 1 mes'),
  paymentGraceDays: z
    .number({ error: 'Ingresa los días de gracia' })
    .min(0, 'No puede ser negativo'),
  description: z.string().optional(),
  benefits: z.string().optional(),
  isActive: z.boolean().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

// ─── Toast Component ─────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium max-w-sm ${
              toast.type === 'success'
                ? 'bg-white border-emerald-100 text-gray-900'
                : 'bg-white border-red-100 text-gray-900'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onEdit,
  onToggleActive,
  togglingId,
}: {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onToggleActive: (plan: MembershipPlan) => void;
  togglingId: number | null;
}) {
  const isToggling = togglingId === plan.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-2xl border shadow-sm flex flex-col transition-shadow hover:shadow-md ${
        plan.isActive ? 'border-gray-100' : 'border-gray-100 opacity-65'
      }`}
    >
      {/* Card Header */}
      <div className="p-6 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              plan.isActive
                ? 'bg-[var(--color-primary)]'
                : 'bg-gray-200'
            }`}
          >
            <CreditCard className={`w-5 h-5 ${plan.isActive ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-base leading-tight">
              {plan.membershipType}
            </h3>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full ${
                plan.isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  plan.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              />
              {plan.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-gray-900">
            ${plan.price.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-400">/ mes</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-gray-50" />

      {/* Card Details */}
      <div className="px-6 py-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            {plan.durationInMonths} {plan.durationInMonths === 1 ? 'mes' : 'meses'} de duración
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{plan.paymentGraceDays} días de gracia</span>
        </div>
        {plan.description && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{plan.description}</span>
          </div>
        )}
        {plan.benefits && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{plan.benefits}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-gray-50 mt-auto">
        {/* Toggle isActive */}
        <button
          onClick={() => onToggleActive(plan)}
          disabled={isToggling}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          title={plan.isActive ? 'Desactivar plan' : 'Activar plan'}
        >
          {isToggling ? (
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          ) : (
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                plan.isActive ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  plan.isActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          )}
          <span>{plan.isActive ? 'Activo' : 'Inactivo'}</span>
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(plan)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
      </div>
    </motion.div>
  );
}

// ─── Plan Form Modal ──────────────────────────────────────────────────────────

function PlanModal({
  isOpen,
  editingPlan,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  editingPlan: MembershipPlan | null;
  onClose: () => void;
  onSubmit: (data: PlanFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      membershipType: '',
      price: undefined,
      durationInMonths: 1,
      paymentGraceDays: 7,
      description: '',
      benefits: '',
      isActive: true,
    },
  });

  const isActiveValue = watch('isActive');

  // Pre-fill form when editing
  useEffect(() => {
    if (editingPlan) {
      reset({
        membershipType: editingPlan.membershipType,
        price: editingPlan.price,
        durationInMonths: editingPlan.durationInMonths,
        paymentGraceDays: editingPlan.paymentGraceDays,
        description: editingPlan.description ?? '',
        benefits: editingPlan.benefits ?? '',
        isActive: editingPlan.isActive,
      });
    } else {
      reset({
        membershipType: '',
        price: undefined,
        durationInMonths: 1,
        paymentGraceDays: 7,
        description: '',
        benefits: '',
        isActive: true,
      });
    }
  }, [editingPlan, reset, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSubmitting, onClose]);

  const inputBase =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:bg-white placeholder:text-gray-400';
  const errorInput = 'ring-2 ring-red-300 border-red-300 bg-red-50/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isSubmitting && onClose()}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                    {editingPlan ? (
                      <Pencil className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {editingPlan
                        ? 'Modifica los datos del plan'
                        : 'Completa los datos del nuevo plan'}
                    </p>
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

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-7 pt-6 pb-7 space-y-5">

                {/* Nombre del Plan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre del plan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('membershipType')}
                    disabled={isSubmitting}
                    placeholder="Ej: Pase Libre Musculación"
                    className={`${inputBase} ${errors.membershipType ? errorInput : ''}`}
                  />
                  {errors.membershipType && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.membershipType.message}
                    </p>
                  )}
                </div>

                {/* Precio + Duración (2 columnas) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        placeholder="0"
                        className={`${inputBase} pl-9 ${errors.price ? errorInput : ''}`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Duración (meses) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register('durationInMonths', { valueAsNumber: true })}
                      disabled={isSubmitting}
                      placeholder="1"
                      className={`${inputBase} ${errors.durationInMonths ? errorInput : ''}`}
                    />
                    {errors.durationInMonths && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.durationInMonths.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Días de gracia */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Días de gracia
                  </label>
                  <input
                    type="number"
                    min={0}
                    {...register('paymentGraceDays', { valueAsNumber: true })}
                    disabled={isSubmitting}
                    placeholder="7"
                    className={`${inputBase} ${errors.paymentGraceDays ? errorInput : ''}`}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Días extra para pagar después del vencimiento
                  </p>
                  {errors.paymentGraceDays && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.paymentGraceDays.message}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    rows={2}
                    {...register('description')}
                    disabled={isSubmitting}
                    placeholder="Ej: Acceso completo a sala de máquinas de lunes a sábados"
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {/* Beneficios */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Beneficios
                  </label>
                  <textarea
                    rows={2}
                    {...register('benefits')}
                    disabled={isSubmitting}
                    placeholder="Ej: Duchas, vestuarios y rutina personalizada"
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {/* Toggle isActive (solo en edición) */}
                {editingPlan && (
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Estado del plan</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Los planes inactivos no aparecen en la PWA
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('isActive', !isActiveValue)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          isActiveValue ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            isActiveValue ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isActiveValue ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        {isActiveValue ? 'Activo' : 'Inactivo'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : editingPlan ? (
                    <>
                      <Pencil className="w-4 h-4" />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Crear plan
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlanesPage() {
  const { token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // ── Toast helpers ──────────────────────────────────────────────────────────

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch institution + plans ──────────────────────────────────────────────

  const fetchPlans = useCallback(
    async (instId: number) => {
      const res = await fetch(
        `${apiUrl}/api/institutions/${instId}/membership-data?includeInactive=true`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error('No se pudieron cargar los planes');
      return res.json() as Promise<MembershipPlan[]>;
    },
    [apiUrl, token],
  );

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // 1. Get institution (admin)
        const instRes = await fetch(`${apiUrl}/api/institutions/my-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!instRes.ok) throw new Error('No se pudo obtener la institución');
        const instData = await instRes.json();
        if (!Array.isArray(instData) || instData.length === 0) {
          throw new Error('No hay institución asociada a tu cuenta');
        }
        const id = Number(instData[0].id);
        setInstitutionId(id);

        // 2. Get plans
        const data = await fetchPlans(id);
        setPlans(data);
      } catch (err: unknown) {
        setFetchError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token, apiUrl, fetchPlans]);

  // ── Open / Close Modal ─────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const openEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
  };

  // ── Submit (create or update) ─────────────────────────────────────────────

  const handleFormSubmit = async (data: PlanFormValues) => {
    if (!institutionId) return;

    const body = {
      membershipType: data.membershipType,
      price: data.price,
      durationInMonths: data.durationInMonths,
      paymentGraceDays: data.paymentGraceDays,
      description: data.description || undefined,
      benefits: data.benefits || undefined,
      ...(editingPlan !== null && { isActive: data.isActive }),
    };

    try {
      const url = editingPlan
        ? `${apiUrl}/api/institutions/${institutionId}/membership-data/${editingPlan.id}`
        : `${apiUrl}/api/institutions/${institutionId}/membership-data`;

      const res = await fetch(url, {
        method: editingPlan ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ||
            (editingPlan ? 'Error al actualizar el plan' : 'Error al crear el plan'),
        );
      }

      // Refresh plans
      const updated = await fetchPlans(institutionId);
      setPlans(updated);

      addToast(
        editingPlan ? 'Plan actualizado correctamente' : 'Plan creado correctamente',
        'success',
      );
      closeModal();
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Ocurrió un error inesperado',
        'error',
      );
    }
  };

  // ── Toggle isActive ────────────────────────────────────────────────────────

  const handleToggleActive = async (plan: MembershipPlan) => {
    if (!institutionId || togglingId !== null) return;
    setTogglingId(plan.id);

    try {
      const res = await fetch(
        `${apiUrl}/api/institutions/${institutionId}/membership-data/${plan.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !plan.isActive }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message || 'Error al cambiar el estado del plan',
        );
      }

      // Optimistic update
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p)),
      );

      addToast(
        !plan.isActive ? 'Plan activado' : 'Plan desactivado',
        'success',
      );
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Error al cambiar el estado',
        'error',
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const activePlans = plans.filter((p) => p.isActive);
  const inactivePlans = plans.filter((p) => !p.isActive);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <PlanModal
        isOpen={modalOpen}
        editingPlan={editingPlan}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Planes de Membresía</h1>
            <p className="text-gray-500">Administra los planes y precios de tu institución</p>
          </div>
          {!loading && !fetchError && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nuevo Plan
            </motion.button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
              <p className="text-sm text-gray-500">Cargando planes...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && fetchError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">No se pudieron cargar los planes</h3>
            <p className="text-sm text-gray-500">{fetchError}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !fetchError && (
          <>
            {/* Stats bar */}
            {plans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
                  <span className="font-bold text-gray-900">{plans.length}</span>
                  <span className="text-gray-500">planes en total</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-sm">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="font-bold text-emerald-700">{activePlans.length}</span>
                  <span className="text-emerald-600">activos</span>
                </div>
                {inactivePlans.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="font-bold text-gray-600">{inactivePlans.length}</span>
                    <span className="text-gray-500">inactivos</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Empty state */}
            {plans.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-14 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CreditCard className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Todavía no hay planes
                </h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Crea el primer plan de membresía para que tus socios puedan inscribirse desde la app.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Crear primer plan
                </motion.button>
              </motion.div>
            )}

            {/* Plans Grid */}
            {plans.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onEdit={openEdit}
                      onToggleActive={handleToggleActive}
                      togglingId={togglingId}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );
}
