'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Users, Mail, ShieldAlert, Award, Search, MoreVertical, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AltaSocioModal, { type MemberEnrolled } from '@/components/dashboard/AltaSocioModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  role: string;
  userId: string;
  dni: string;
  fullName: string;
  status: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  membershipData: {
    id: string;
    membershipType: string;
    price: string;
  };
}

interface Plan {
  id: string;
  membershipType: string;
  price: string;
  isActive: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// ─── Toast Container ──────────────────────────────────────────────────────────

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
            className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium max-w-sm bg-white"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className="flex-1 text-gray-900">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'active')
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Award className="w-3 h-3 mr-1" /> Activo
      </span>
    );
  if (status === 'pending')
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pendiente
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      Inactivo
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MiembrosPage() {
  const { token } = useAuth();
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
        const headers = { Authorization: `Bearer ${token}` };

        const myRes = await fetch(`${apiUrl}/api/institutions/my-admin`, { headers });
        if (!myRes.ok) return;
        const myData = await myRes.json();

        if (Array.isArray(myData) && myData.length > 0) {
          const id = String(myData[0].id);
          setInstitutionId(id);

          const [membersRes, plansRes] = await Promise.all([
            fetch(`${apiUrl}/api/institutions/${id}/members`, { headers }),
            fetch(`${apiUrl}/api/institutions/${id}/membership-data`, { headers }),
          ]);

          if (membersRes.ok) setMembers(await membersRes.json());
          if (plansRes.ok) setPlans(await plansRes.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleSuccess = useCallback((newMember: MemberEnrolled) => {
    setMembers((prev) => [newMember as unknown as Member, ...prev]);
    setIsModalOpen(false);
    addToast(`${newMember.fullName || 'Socio'} dado de alta correctamente`, 'success');
  }, [addToast]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.fullName || m.user?.name || '').toLowerCase().includes(q) ||
      (m.dni || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-crail)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Miembros</h1>
          <p className="text-stone-500">Gestiona los afiliados y sus suscripciones en tu institución</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o DNI..."
              className="pl-9 pr-4 py-2 border border-[#B1ADA1]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] focus:border-transparent text-sm w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[var(--color-crail)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-crail-dark)] transition-colors shadow-sm whitespace-nowrap"
          >
            + Inscribir
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#B1ADA1]/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-crail)]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[var(--color-crail)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Miembros Totales</p>
              <h3 className="text-2xl font-bold text-stone-900">{members.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#B1ADA1]/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Activos</p>
              <h3 className="text-2xl font-bold text-stone-900">{members.filter((m) => m.status === 'active').length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#B1ADA1]/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Pendientes</p>
              <h3 className="text-2xl font-bold text-stone-900">{members.filter((m) => m.status === 'pending').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#B1ADA1]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-[#B1ADA1]/20">
                <th className="py-4 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Miembro</th>
                <th className="py-4 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">DNI</th>
                <th className="py-4 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Plan</th>
                <th className="py-4 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-6 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B1ADA1]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-stone-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-8 h-8 text-stone-400" />
                      </div>
                      <p className="font-medium text-stone-900">
                        {search ? 'Sin resultados para la búsqueda' : 'No hay miembros registrados'}
                      </p>
                      <p className="text-sm mt-1">
                        {search ? 'Intentá con otro nombre o DNI.' : 'Cuando los usuarios se afilien, aparecerán aquí.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-pampas)] flex items-center justify-center text-[var(--color-crail)] font-serif font-bold border border-[#B1ADA1]/20 shrink-0">
                          {(member.fullName || member.user?.name || 'M').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-900 group-hover:text-[var(--color-crail)] transition-colors">
                            {member.fullName || member.user?.name || 'Usuario MembriX'}
                          </p>
                          <p className="text-xs text-stone-500">{member.user?.email || 'Sin correo'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-stone-900 font-medium">{member.dni || '--'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-stone-600">{member.membershipData?.membershipType || 'Básico'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-stone-400 hover:text-[var(--color-crail)] transition-colors p-2 rounded-lg hover:bg-orange-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alta de Socio Modal */}
      {institutionId && (
        <AltaSocioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          institutionId={institutionId}
          plans={plans.filter((p) => p.isActive)}
          token={token}
          onSuccess={handleSuccess}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
