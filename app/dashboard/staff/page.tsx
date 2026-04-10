'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, Award, Search, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface StaffMember {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function StaffPage() {
  const { token } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

        const myRes = await fetch(`${apiUrl}/api/institutions/my-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!myRes.ok) return;
        const myData = await myRes.json();

        if (Array.isArray(myData) && myData.length > 0) {
          const id = myData[0].id;
          const staffRes = await fetch(`${apiUrl}/api/institutions/${id}/staff`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (staffRes.ok) {
            setStaff(await staffRes.json());
          }
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStaff();
  }, [token]);

  const filtered = staff.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.user?.name || '').toLowerCase().includes(q) ||
      (m.user?.email || '').toLowerCase().includes(q)
    );
  });

  const RoleBadge = ({ role }: { role: string }) => {
    if (role === 'institution')
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-crail)] text-white shadow-sm">
          <Award className="w-3 h-3 mr-1" /> Administrador
        </span>
      );
    if (role === 'viewer')
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Visitante
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Staff Base
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
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Equipo de Trabajo (Staff)</h1>
          <p className="text-stone-500">Supervisa los accesos del personal y administradores de tu institución</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="pl-9 pr-4 py-2 border border-[#B1ADA1]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] focus:border-transparent text-sm w-full md:w-64"
            />
          </div>
          <button className="px-4 py-2 bg-[var(--color-crail)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-crail-dark)] transition-colors shadow-sm whitespace-nowrap">
            + Añadir
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#B1ADA1]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 uppercase bg-[var(--color-pampas)] border-b border-[#B1ADA1]/30">
              <tr>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Rol Asignado</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                    <p className="text-base font-medium text-stone-700">
                      {search ? 'Sin resultados para la búsqueda' : 'No hay miembros del equipo registrados'}
                    </p>
                    <p className="text-sm mt-1">
                      {search ? 'Intentá con otro nombre o email.' : 'Agregá tu primer miembro usando el botón "+ Añadir".'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white border-b border-[#B1ADA1]/10 hover:bg-[var(--color-pampas)]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-cloudy)] flex items-center justify-center text-[var(--color-crail)] font-serif font-bold text-lg shrink-0">
                          {(member.user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800">{member.user?.name}</p>
                          <p className="text-stone-500 text-xs flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {member.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-[var(--color-crail)] transition-colors p-2 rounded-lg hover:bg-[var(--color-crail)]/10">
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
