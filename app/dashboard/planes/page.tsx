import React from 'react';
import { CreditCard } from 'lucide-react';

export default function PlanesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planes de Membresía</h1>
        <p className="text-gray-500">Administra los planes y precios de tu institución</p>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sección en Desarrollo</h2>
        <p className="text-gray-500">
          La gestión de planes estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
