'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, CreditCard, TrendingUp, Building2, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import InstitutionPromptCard from '@/components/auth/InstitutionPromptCard';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'blue' 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  subtitle: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </motion.div>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  color = 'primary' 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  href: string;
  color?: string;
}) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
      >
        <div className={`p-3 rounded-xl ${color === 'primary' ? 'bg-[var(--color-primary)]' : 'bg-gray-100'} w-fit mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color === 'primary' ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </motion.div>
    </Link>
  );
};

export default function DashboardPage() {
  const { user, institutions, loading } = useAuth();

  // Mostrar loading mientras el contexto carga las instituciones
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Si no tiene institución, mostrar el prompt
  if (institutions.length === 0) {
    return <InstitutionPromptCard />;
  }

  // Dashboard normal si tiene institución
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-gray-500">
          Panel de Control de Instituciones
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Miembros Activos"
          value="—"
          subtitle="Total de miembros registrados"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Nuevos Este Mes"
          value="—"
          subtitle="Miembros registrados este mes"
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Eventos Activos"
          value="—"
          subtitle="Eventos programados"
          color="purple"
        />
        <StatCard
          icon={CreditCard}
          title="Planes Disponibles"
          value="—"
          subtitle="Planes de membresía"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            icon={Users}
            title="Gestionar Miembros"
            description="Ver, agregar y administrar miembros de tu institución"
            href="/dashboard/miembros"
            color="primary"
          />
          <QuickActionCard
            icon={CreditCard}
            title="Administrar Planes"
            description="Configura y gestiona planes de membresía"
            href="/dashboard/planes"
            color="primary"
          />
          <QuickActionCard
            icon={Calendar}
            title="Crear Evento"
            description="Organiza eventos para tus miembros"
            href="/dashboard/eventos"
            color="primary"
          />
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-pantano-dark)] rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">¡Bienvenido a MembriX!</h2>
            <p className="text-white/90 mb-6 max-w-2xl">
              Tu plataforma integral para gestionar miembros, eventos y planes de tu institución. 
              Comienza explorando las diferentes secciones del panel de administración.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/miembros"
                className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:shadow-lg transition-all"
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

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay actividad reciente</p>
          <p className="text-sm text-gray-400 mt-1">
            La actividad de tu institución aparecerá aquí
          </p>
        </div>
      </div>
    </div>
  );
}
