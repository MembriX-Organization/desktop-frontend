import React from 'react';
import { Calendar } from 'lucide-react';

export default function EventosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
        <p className="text-gray-500">Organiza y gestiona eventos para tus miembros</p>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sección en Desarrollo</h2>
        <p className="text-gray-500">
          La gestión de eventos estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
