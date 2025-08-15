import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));//dashboard
export const RankCandidatesPage = lazy(() => import('src/pages/rank-candidates')); //blog
export const CandidatesPage = lazy(() => import('src/pages/candidates')); //user
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const UploadCVPage = lazy(() => import('src/pages/upload-cv')); //products

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

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
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
  // {
  //   path: '404',
  //   element: <Page404 />,
  // },
  // { path: '*', element: <Page404 /> },
];
