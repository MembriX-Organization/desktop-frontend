import React from 'react';
import InstitutionRequestForm from '@/components/auth/InstitutionRequestForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitar Alta | MembriX',
  description: 'Solicita el alta de tu institución en MembriX',
};

export default function SolicitarAltaPage() {
  return <InstitutionRequestForm />;
}
