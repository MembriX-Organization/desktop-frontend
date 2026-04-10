'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Search, PlusCircle, Edit2, ShieldCheck, MoreVertical, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  id: string;
  membershipType: string;
  description: string;
  benefits: string;
  price: string;
  durationInMonths: number;
  paymentGraceDays: number;
  isActive: boolean;
}

export default function PlanesPage() {
  const { token, user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [institutionId, setInstitutionId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    membershipType: '',
    description: '',
    benefits: '',
    price: '',
    durationInMonths: 1,
    paymentGraceDays: 7,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlans = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/institutions/${id}/plans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const myRes = await fetch(`${apiUrl}/api/institutions/my-admin`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!myRes.ok) throw new Error('No admin institution found');
        const myData = await myRes.json();
        
        if (myData && myData.length > 0) {
          const id = myData[0].id;
          setInstitutionId(id);
          await fetchPlans(id);
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) init();
  }, [token]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId || !token) return;
    
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/institutions/${institutionId}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({
          membershipType: '',
          description: '',
          benefits: '',
          price: '',
          durationInMonths: 1,
          paymentGraceDays: 7,
          isActive: true,
        });
        await fetchPlans(institutionId);
      } else {
        const err = await res.json();
        console.error('Failed to create plan:', err);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-crail)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Planes y Suscripciones</h1>
          <p className="text-stone-500">Define los diferentes niveles de acceso y cuotas para tus miembros</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-crail)] text-white rounded-xl text-sm font-medium hover:bg-[#A95A4B] transition-colors shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full bg-white border border-[#B1ADA1]/30 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Aún no hay planes creados</h3>
            <p className="text-stone-500 mb-6">Crea tu primer plan para que los miembros puedan afiliarse a tu institución.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Crear mi primer plan
            </button>
          </div>
        ) : (
          plans.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={plan.id}
              className={`bg-white rounded-2xl border ${plan.isActive ? 'border-[#B1ADA1]/30' : 'border-stone-200 opacity-60'} overflow-hidden shadow-sm relative group`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-stone-900">{plan.membershipType}</h3>
                      {plan.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500 line-clamp-2 h-10">{plan.description || 'Sin descripción'}</p>
                  </div>
                  <button className="text-stone-400 hover:text-[var(--color-crail)] transition-colors p-1.5 rounded-lg hover:bg-orange-50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline text-stone-900">
                    <span className="text-3xl font-bold tracking-tight">${Number(plan.price).toLocaleString()}</span>
                    <span className="text-sm text-stone-500 ml-1 font-medium">/{plan.durationInMonths === 1 ? 'mes' : `${plan.durationInMonths} meses`}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Beneficios</p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    {plan.benefits ? plan.benefits.split('\n').map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--color-crail)] flex-shrink-0" />
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    )) : (
                      <li className="text-stone-400 italic">No se especificaron beneficios.</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="border-t border-[#B1ADA1]/20 bg-stone-50/50 p-4 flex justify-between items-center text-xs text-stone-500">
                <span>{plan.paymentGraceDays} días de gracia</span>
                <button className="font-medium text-[var(--color-crail)] hover:underline flex items-center gap-1">
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl border border-[#B1ADA1]/20 w-full max-w-lg z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#B1ADA1]/20 bg-[#F4F3EE]/50">
                <h2 className="text-lg font-serif font-bold text-stone-900">Crear Nuevo Plan</h2>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-black/5 transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre del Plan</label>
                    <input 
                      required
                      type="text" 
                      value={formData.membershipType}
                      onChange={e => setFormData({...formData, membershipType: e.target.value})}
                      placeholder="Ej: Plan Básico, Premium..." 
                      className="w-full px-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Precio (Local)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">$</span>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00" 
                        className="w-full pl-8 pr-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Duración (Meses)</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={formData.durationInMonths}
                      onChange={e => setFormData({...formData, durationInMonths: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Días de Gracia</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={formData.paymentGraceDays}
                      onChange={e => setFormData({...formData, paymentGraceDays: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
                    <input 
                      type="text" 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Descripción corta del plan..." 
                      className="w-full px-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Beneficios (uno por línea)</label>
                    <textarea 
                      rows={3}
                      value={formData.benefits}
                      onChange={e => setFormData({...formData, benefits: e.target.value})}
                      placeholder="Acceso a canchas&#10;Descuentos en tienda&#10;..." 
                      className="w-full px-4 py-2 border border-[#B1ADA1]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-crail)] text-sm resize-none"
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-stone-700">Estado del plan</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isActive}
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-crail)]"></div>
                      <span className="ml-3 text-sm text-stone-500">{formData.isActive ? 'Activo' : 'Inactivo'}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#B1ADA1]/20 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors text-sm"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[var(--color-crail)] text-white font-medium rounded-xl hover:bg-[#A95A4B] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : 'Guardar Plan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
