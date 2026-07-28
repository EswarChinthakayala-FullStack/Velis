import React from 'react';
import { useParams } from 'react-router-dom';
import { ClientsListPage } from '../../modules/clients/clients-list-page';
import { ClientDetailPage } from '../../modules/clients/client-detail-page';

export const ClientsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId?: string }>();

  if (clientId) {
    return <ClientDetailPage />;
  }

  return <ClientsListPage />;
};

export default ClientsPage;
