'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, CreditCard, TrendingUp, Building2, Activity, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import InstitutionPromptCard from '@/components/auth/InstitutionPromptCard';

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-[#B1ADA1]/20 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-xl bg-[#F4F3EE] text-[var(--color-crail)]">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-stone-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-stone-600">{title}</p>
    <p className="text-xs text-[#B1ADA1] mt-1">{subtitle}</p>
  </motion.div>
);

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  href,
  accent = false,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  accent?: boolean;
}) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#B1ADA1]/20 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className={`p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform ${accent ? 'bg-[var(--color-crail)]' : 'bg-[#F4F3EE]'}`}>
        <Icon className={`w-6 h-6 ${accent ? 'text-white' : 'text-stone-600'}`} />
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500">{description}</p>
    </motion.div>
  </Link>
);

export default function DashboardPage() {
  const { user, institutions, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-crail)]"></div>
      </div>
    );
  }

  if (institutions.length === 0) {
    return <InstitutionPromptCard />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
          ¡Bienvenido, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-stone-500">Panel de Control de Instituciones</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Miembros Activos" value="—" subtitle="Total de miembros registrados" />
        <StatCard icon={TrendingUp} title="Nuevos Este Mes" value="—" subtitle="Miembros registrados este mes" />
        <StatCard icon={Calendar} title="Eventos Activos" value="—" subtitle="Eventos programados" />
        <StatCard icon={CreditCard} title="Planes Disponibles" value="—" subtitle="Planes de membresía" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            icon={Users}
            title="Gestionar Miembros"
            description="Ver, agregar y administrar miembros de tu institución"
            href="/dashboard/miembros"
            accent
          />
          <QuickActionCard
            icon={Shield}
            title="Gestionar Staff"
            description="Supervisa los accesos del personal de tu institución"
            href="/dashboard/staff"
            accent
          />
          <QuickActionCard
            icon={CreditCard}
            title="Administrar Planes"
            description="Configura y gestiona planes de membresía"
            href="/dashboard/planes"
            accent
          />
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--color-crail)] rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-serif font-bold mb-3">¡Bienvenido a MembriX!</h2>
            <p className="text-white/90 mb-6 max-w-2xl">
              Tu plataforma integral para gestionar miembros, eventos y planes de tu institución.
              Comienza explorando las diferentes secciones del panel de administración.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/miembros"
                className="px-6 py-3 bg-white text-[var(--color-crail)] rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Explorar Miembros
              </Link>
              <Link
                href="/dashboard/planes"
                className="px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Planes
              </Link>
            </div>
          </div>
          <Building2 className="w-24 h-24 text-white/20 hidden lg:block" />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#B1ADA1]/20 text-center">
          <Activity className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500">No hay actividad reciente</p>
          <p className="text-sm text-stone-400 mt-1">La actividad de tu institución aparecerá aquí</p>
        </div>
      </div>
    </div>
  );
}
