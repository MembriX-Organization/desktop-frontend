'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Building2, Users, Calendar, CreditCard, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: Building2, label: 'Dashboard' },
  { href: '/dashboard/miembros', icon: Users, label: 'Miembros/Staff' },
  { href: '/dashboard/planes', icon: CreditCard, label: 'Planes' },
  { href: '/dashboard/eventos', icon: Calendar, label: 'Eventos' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
            <span className="text-xl font-serif text-white font-bold italic">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MembriX</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-serif text-white font-bold italic">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MembriX</h1>
                <p className="text-sm text-gray-500">Administración</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-serif text-white font-bold italic">M</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">MembriX</h1>
                      <p className="text-sm text-gray-500">Administración</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[var(--color-primary)] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      logout();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
