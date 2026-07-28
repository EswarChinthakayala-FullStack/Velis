import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider
 * Application-wide React Query v5 provider wrapper.
 * Configures default staleTime, caching, and retry policies for Velis API state management.
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: (failureCount, error: any) => {
              if (failureCount >= 2) return false;
              // Retry on transient network errors or HTTP/2 protocol resets
              const msg = (error?.message || '').toLowerCase();
              if (msg.includes('fetch') || msg.includes('network') || msg.includes('connection') || msg.includes('protocol') || msg.includes('failed')) {
                return true;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
