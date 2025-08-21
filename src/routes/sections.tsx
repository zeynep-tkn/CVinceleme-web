import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const RankCandidatesPage = lazy(() => import('src/pages/rank-candidates'));
export const CandidatesPage = lazy(() => import('src/pages/candidates'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const UploadCVPage = lazy(() => import('src/pages/upload-cv'));

// ----------------------------------------------------------------------

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// --- YENİ EKLENEN KORUMA (GUARD) COMPONENT'İ ---
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');

  // Eğer token yoksa (kullanıcı giriş yapmamışsa),
  // kullanıcıyı giriş yapma sayfasına yönlendir.
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // Eğer token varsa, kullanıcının gitmek istediği sayfayı göster.
  return <>{children}</>;
};
// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
  {
    // Ana uygulama sayfaları bu yolun altında toplanacak.
    // Bu yolun tamamı artık AuthGuard ile korunuyor.
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'candidate', element: <CandidatesPage /> },
      { path: 'upload', element: <UploadCVPage /> },
      { path: 'rank', element: <RankCandidatesPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
];
