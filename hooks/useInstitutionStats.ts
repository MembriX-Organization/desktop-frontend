'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface RecentQrAccess {
  userName: string;
  eventName: string;
  joinedAt: string;
}

export interface InstitutionStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  activeEvents: number;
  recentQrAccess: RecentQrAccess[];
}

export function useInstitutionStats(institutionId: number | null) {
  const { token } = useAuth();
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!institutionId || !token) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/institutions/${institutionId}/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) throw new Error('Error al obtener estadísticas');

      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [institutionId, token]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error };
}
