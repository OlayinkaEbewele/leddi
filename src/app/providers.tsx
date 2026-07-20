import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import { UserProvider } from '@/auth/UserContext';
import i18n from '@/i18n/i18n';
import { ThemeModeProvider } from '@/theme/ThemeModeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeModeProvider>
          <UserProvider>{children}</UserProvider>
        </ThemeModeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export { queryClient };
