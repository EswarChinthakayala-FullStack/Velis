import React from 'react';
import { AppRouter } from './router';
import { QueryProvider } from './providers/QueryProvider';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}
