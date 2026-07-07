/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation, NavigationItem, Branding } from '@toolpad/core/AppProvider';
import axios from '@/lib/axios';
import theme from '@/theme';
import ToolbarAdminMenu from './ToolbarAdminMenu';
import ToolbarAccountMenu from './ToolbarAccountMenu';
import { subscribeAuthChanged } from '@/lib/auth-events';
import { SessionContext, SessionInfo } from '@/providers/SessionContext';
import { UnsavedChangesProvider } from "@/providers/UnsavedChangesProvider";
import { Dashboard, Traffic, Factory, Toys, ListAlt, ManageSearch, Settings } from '@mui/icons-material';


const DEFAULT_BRANDING: Branding = {
  logo: <img src="/Freedom_icon.png" alt="Logo" />,
  title: 'Freedom',
  homeUrl: '/map'
};

function NavImageIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={20}
      height={20}
      style={{
        width: 20,
        height: 20,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}

const NODE_ICON_MAP: Record<string, React.ReactNode> = {
  'freedom.map': <Dashboard />,
  'freedom.log': <ManageSearch />,
  infrastructure: <Traffic />,
  equipment: <Factory />,
  robot: <Toys />,
  job: <ListAlt />,
};

function getNodeIcon(node: string) {
  return NODE_ICON_MAP[node];
}

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [navigation, setNavigation] = useState<Navigation>([]);
  const [structure, setStructure] = useState<{ [key: string]: string[] } | null>(null);
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);

  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    authenticated: false,
    userId: null,
    role: null,
    username: null,
  });

  const canSeeJobActive = sessionInfo.authenticated === true;
  const canSeeJobCreate = sessionInfo.role === 'admin';
  const canSeeConfig = sessionInfo.role === 'admin';

  const t = useTranslations();

  function filterChildren(children?: string[]): string[] | undefined {
    if (!children) return undefined;
    return children.filter((child) => {
      if (!canSeeJobActive && child.startsWith('job.')) return false;
      if (child === 'job.create' && !canSeeJobCreate) return false;
      return true;
    });
  }

  function makeNavigationItem(node: string, children?: string[]): NavigationItem {
    const filtered = filterChildren(children);
    return {
      segment: node.split('.').pop(),
      title: t("Node."+node+".name"),
      icon: getNodeIcon(node),
      children: filtered ? filtered.map((child) => makeNavigationItem(child)) : undefined,
    }
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const fixedTitle = typeof branding.title === 'string' && branding.title.length > 0
      ? branding.title
      : 'Freedom';
    const applyTitle = () => {
      if (document.title !== fixedTitle) {
        document.title = fixedTitle;
      }
    };
    applyTitle();
    const observer = new MutationObserver(() => {
      applyTitle();
    });
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [branding.title]);

  useEffect(() => {
    let cancelled = false;
    const fetchUIConfig = async () => {
      try {
        const res = await axios.post<Array<{ sub_title?: string }>>("/domain/freedom.user_interface");
        if (cancelled) return;
        const config = res.data[0];
        const subTitle = config?.sub_title;
        if (subTitle) {
          setBranding(prev => ({
            ...prev,
            title: subTitle
          }));
        }
      } catch (error) {
        console.error("Failed to fetch UI config:", error);
        if (!cancelled) {
          setTimeout(() => {
            fetchUIConfig();
          }, 5000);
        }
      }
    };
    fetchUIConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshSession = useCallback(() => {
    fetch('/api/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setSessionInfo({
          authenticated: d?.authenticated === true,
          userId: d?.userId ?? null,
          role: d?.role ?? null,
          username: d?.username ?? null,
        });
      })
      .catch(() => {
        setSessionInfo({ authenticated: false, userId: null, role: null, username: null });
      });
  }, []);

  // 初回
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    return subscribeAuthChanged(() => {
      refreshSession();
    });
  }, [refreshSession]);

  useEffect(() => {
    let cancelled = false;
    const fetchStructure = async () => {
      try {
        const res = await axios.post<{ [key: string]: string[] }>(
          '/node/freedom.main',
          { func: 'fetch_structure' }
        );
        if (!cancelled) {
          setStructure(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch structure:", error);
        if (!cancelled) {
          setTimeout(() => {
            fetchStructure();
          }, 5000);
        }
      }
    };
    fetchStructure();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!structure) return;
    const base = Object.keys(structure)
      .map((key) => {
        if (!canSeeJobActive && (key === 'job' || key.startsWith('job.'))) return null;
        if (key === 'job.create' && !canSeeJobCreate) return null;
        const filtered = filterChildren(structure[key]);
        if (key === 'job' && (!filtered || filtered.length === 0)) return null;
        return makeNavigationItem(key, filtered);
      })
      .filter((x): x is NavigationItem => x !== null);

    const ret: Navigation = [
      {
        segment: 'map',
        title: t('Node.freedom.map.name'),
        icon: <Dashboard />,
      },
      ...base,
      {
        segment: 'log',
        title: t('Node.freedom.log.name'),
        icon: <ManageSearch />,
      },
    ];

    if (canSeeConfig) {
      ret.push(
        {
          kind: 'divider',
        },
        {
          segment: 'config',
          title: t('Navigation.config'),
          icon: <Settings />,
          children: [
            {
              segment: 'freedom',
              title: t('Node.freedom.name'),
              icon: <NavImageIcon src="/Freedom_icon.png" alt="Freedom" />,
              children: [
                {
                  segment: 'main',
                  title: t('Node.freedom.main.name'),
                },
                {
                  segment: 'log',
                  title: t('Node.freedom.log.name'),
                },
                {
                  segment: 'user_interface',
                  title: t('Node.freedom.user_interface.name'),
                },
                {
                  segment: 'map',
                  title: t('Node.freedom.map.name'),
                },
              ],
            },
            ...Object.keys(structure).map((key) =>
              makeNavigationItem(key, structure[key])
            ),
          ],
        }
      );
    }
    setNavigation(ret);
  }, [structure, canSeeJobActive, canSeeJobCreate, canSeeConfig, t]);

  return (
    <SessionContext.Provider value={sessionInfo}>
      <NextAppProvider navigation={navigation} branding={branding} theme={theme}>
        <UnsavedChangesProvider>
          <DashboardLayout
            slots={{
              toolbarActions: () => (
                <>
                  <ToolbarAdminMenu />
                  <ToolbarAccountMenu />
                </>
              ),
            }}
          >
            {children}
          </DashboardLayout>
        </UnsavedChangesProvider>
      </NextAppProvider>
    </SessionContext.Provider>
 );
}
