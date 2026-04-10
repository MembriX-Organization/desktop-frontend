'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, ShieldAlert, Award, Search, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

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

export default function MiembrosPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInstitutionAndMembers = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

        const myRes = await fetch(`${apiUrl}/api/institutions/my-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!myRes.ok) throw new Error('No se pudo obtener la institución');
        const myData = await myRes.json();

        if (Array.isArray(myData) && myData.length > 0) {
          const id = myData[0].id;
          const membersRes = await fetch(`${apiUrl}/api/institutions/${id}/members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (membersRes.ok) {
            setMembers(await membersRes.json());
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInstitutionAndMembers();
  }, [token]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.fullName || m.user?.name || '').toLowerCase().includes(q) ||
      (m.dni || '').toLowerCase().includes(q)
    );
  });

  const StatusBadge = ({ status }: { status: string }) => {
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
  };

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
          <button className="px-4 py-2 bg-[var(--color-crail)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-crail-dark)] transition-colors shadow-sm whitespace-nowrap">
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
    </div>
  );
}
