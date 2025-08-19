import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; // 1. Adım: Import et
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      // 2. Adım: App komponentini HelmetProvider ile sarmala
      <HelmetProvider>
        <App>
          <Outlet />
        </App>
      </HelmetProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);