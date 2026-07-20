import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from '@/auth/UserContext';
import { AppShell } from '@/components/AppShell';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LoansListPage } from '@/features/loans-list/LoansListPage';

const LoanDetailsPage = lazy(() =>
  import('@/features/loan-details/LoanDetailsPage').then((m) => ({ default: m.LoanDetailsPage })),
);

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress size={28} />
    </Box>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppShell>{children}</AppShell>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/prime" replace />} />
      <Route
        path="/prime"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/prime/loans"
        element={
          <ProtectedLayout>
            <LoansListPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/prime/loans/:acquireId"
        element={
          <ProtectedLayout>
            <Suspense fallback={<PageLoader />}>
              <LoanDetailsPage />
            </Suspense>
          </ProtectedLayout>
        }
      />
      <Route
        path="/prime/loans/:acquireId/:tab"
        element={
          <ProtectedLayout>
            <Suspense fallback={<PageLoader />}>
              <LoanDetailsPage />
            </Suspense>
          </ProtectedLayout>
        }
      />
      {/* Legacy redirects */}
      <Route path="/loans/*" element={<Navigate to="/prime/loans" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
