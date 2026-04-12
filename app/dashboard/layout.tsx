import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { SocketProvider } from '@/contexts/SocketContext';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SocketProvider>
  );
}
