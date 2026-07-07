/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client'
import { Suspense } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import LinearProgress from '@mui/material/LinearProgress';
import DashboardProvider from '@/providers/DashboardProvider';


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <Suspense fallback={<LinearProgress />}>
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </Suspense>
    </AppRouterCacheProvider>
  );
}