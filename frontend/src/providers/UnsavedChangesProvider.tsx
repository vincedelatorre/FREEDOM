/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useTranslations } from "next-intl";


type CtxValue = {
  setDirty: (dirty: boolean) => void;
};

const UnsavedChangesContext = React.createContext<CtxValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogs = useDialogs();
  const tUnsaved = useTranslations("Common.unsavedNavigation");

  const dirtyRef = React.useRef(false);

  const setDirty = React.useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const confirmUnsaved = React.useCallback(async () => {
    if (!dirtyRef.current) return true;
    const ok = await dialogs.confirm(tUnsaved("body"), {
      title: tUnsaved("title"),
      okText: tUnsaved("ok"),
      cancelText: tUnsaved("cancel"),
    });
    return ok;
  }, [dialogs, tUnsaved]);

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  React.useEffect(() => {
    const onDocumentClickCapture = (e: MouseEvent) => {
      if (!dirtyRef.current) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const next = `${url.pathname}${url.search}${url.hash}`;
      const cur = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next === cur) return;

      e.preventDefault();
      e.stopPropagation();

      void (async () => {
        const ok = await confirmUnsaved();
        if (!ok) return;
        router.push(next as any);
      })();
    };

    document.addEventListener("click", onDocumentClickCapture, true);
    return () => document.removeEventListener("click", onDocumentClickCapture, true);
  }, [confirmUnsaved, router]);

  const value = React.useMemo<CtxValue>(() => ({ setDirty }), [setDirty]);

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesGuard(isDirty: boolean) {
  const ctx = React.useContext(UnsavedChangesContext);

  React.useEffect(() => {
    ctx?.setDirty(!!isDirty);
    return () => {
      ctx?.setDirty(false);
    };
  }, [ctx, isDirty]);
}
