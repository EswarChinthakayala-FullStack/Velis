import React from 'react';
import { ClientPortalView } from '../../components/views/ClientPortalView';
import { INITIAL_CLIENTS, INITIAL_INVOICES } from '../../data/mockData';

export const ClientPortalPage: React.FC = () => {
  return <ClientPortalView clients={INITIAL_CLIENTS} invoices={INITIAL_INVOICES} />;
};

export default ClientPortalPage;
