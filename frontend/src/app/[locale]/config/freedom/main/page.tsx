/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useDialogs } from '@toolpad/core/useDialogs';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useTranslations } from 'next-intl';
import axios from '@/lib/axios';


export default function FreedomConfig() {
  const [loading, setLoading] = useState<boolean>(false);
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const t = useTranslations('Node.freedom.main');
  const title = t('name');

  const handleClick = async (): Promise<void> => {
    if (loading) return;

    const ok = await dialogs.confirm(
      t('restart.dialog.content'),
      {
        title: t('restart.dialog.title'),
        okText: t('restart.dialog.ok'),
        cancelText: t('restart.dialog.cancel'),
      }
    );

    if (!ok) return;

    setLoading(true);
    try {
      await axios.post('/node/freedom.main', {
        func: 'restart',
        kwargs: { version: 'main' },
      });
      notifications.show(t('restart.success'), {
        severity: 'success',
        autoHideDuration: 3000,
      });
    } catch {
      notifications.show(t('restart.error'), {
        severity: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title={title}>
      <Button onClick={handleClick} variant="contained" disabled={loading}>{t('restart.button')}</Button>
    </PageContainer>
  );
}
