'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstitutionStats } from '@/hooks/useInstitutionStats';
import { Users, Calendar, CreditCard, AlertTriangle, Building2, Activity, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import InstitutionPromptCard from '@/components/auth/InstitutionPromptCard';

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  accent = false,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  accent?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-[#B1ADA1]/20 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${accent ? 'bg-amber-50 text-amber-600' : 'bg-[#F4F3EE] text-[var(--color-crail)]'}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-stone-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-stone-600">{title}</p>
    <p className="text-xs text-[#B1ADA1] mt-1">{subtitle}</p>
  </motion.div>
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#B1ADA1]/20 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-stone-100 mb-4" />
    <div className="h-8 w-16 bg-stone-100 rounded mb-2" />
    <div className="h-4 w-32 bg-stone-100 rounded mb-1" />
    <div className="h-3 w-24 bg-stone-100 rounded" />
  </div>
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

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'ahora mismo';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function DashboardPage() {
  const { user, institutions, currentInstitution, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useInstitutionStats(
    currentInstitution?.id ?? null,
  );

  if (authLoading) {
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
        <p className="text-stone-500">
          {currentInstitution?.name ?? 'Panel de Control'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              icon={Users}
              title="Socios Activos"
              value={stats.activeMembers}
              subtitle={`de ${stats.totalMembers} socios en total`}
            />
            <StatCard
              icon={AlertTriangle}
              title="Próximos a Vencer"
              value={stats.expiringSoonMembers}
              subtitle="membresías en los próximos 7 días"
              accent={stats.expiringSoonMembers > 0}
            />
            <StatCard
              icon={Calendar}
              title="Eventos Activos"
              value={stats.activeEvents}
              subtitle="eventos próximos programados"
            />
            <StatCard
              icon={CreditCard}
              title="Total Socios"
              value={stats.totalMembers}
              subtitle="socios registrados históricamente"
            />
          </>
        ) : (
          <>
            <StatCard icon={Users} title="Socios Activos" value="—" subtitle="Sin datos disponibles" />
            <StatCard icon={AlertTriangle} title="Próximos a Vencer" value="—" subtitle="Sin datos disponibles" />
            <StatCard icon={Calendar} title="Eventos Activos" value="—" subtitle="Sin datos disponibles" />
            <StatCard icon={CreditCard} title="Total Socios" value="—" subtitle="Sin datos disponibles" />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            icon={Users}
            title="Gestionar Socios"
            description="Ver, agregar y administrar socios de tu institución"
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
              Tu plataforma integral para gestionar socios, eventos y planes de tu institución.
              Comienza explorando las diferentes secciones del panel de administración.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/miembros"
                className="px-6 py-3 bg-white text-[var(--color-crail)] rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Explorar Socios
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

      {/* Recent QR Activity */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 mb-4">Últimos Accesos por QR</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-[#B1ADA1]/20 overflow-hidden">
          {statsLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-stone-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-stone-100 rounded" />
                    <div className="h-3 w-24 bg-stone-100 rounded" />
                  </div>
                  <div className="h-3 w-16 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          ) : stats && stats.recentQrAccess.length > 0 ? (
            <ul className="divide-y divide-[#B1ADA1]/10">
              {stats.recentQrAccess.map((access, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F4F3EE] flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-[var(--color-crail)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{access.userName}</p>
                    <p className="text-xs text-stone-400 truncate">{access.eventName}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#B1ADA1] shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(access.joinedAt)}
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No hay accesos por QR registrados</p>
              <p className="text-sm text-stone-400 mt-1">Los accesos aparecerán aquí cuando los socios usen sus carnets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
