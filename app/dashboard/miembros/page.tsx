import React from 'react';
import { Users } from 'lucide-react';

export default function MiembrosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Miembros / Staff</h1>
        <p className="text-gray-500">Gestiona los miembros y staff de tu institución</p>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sección en Desarrollo</h2>
        <p className="text-gray-500">
          La gestión de miembros estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
