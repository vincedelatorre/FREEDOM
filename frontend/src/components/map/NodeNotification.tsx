/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import type { NodeStatus } from "@/types/node";
import type { NodeMarkerItem } from "@/types/map";

type AnyNode = NodeStatus | NodeMarkerItem;

type Props = {
  // ノード配列
  nodes: AnyNode[];
  // stateからseverityを判定
  classifyState?: (state: number) => "warning" | "error" | null;
  // 通知キーの作成
  makeKey?: (n: AnyNode) => string;
  // infoを整形
  formatInfo?: (info?: string[] | undefined) => string;
};

type OpenEntry = {
  // Toolpadの通知キー
  notifKey: string;
  // 最後に表示したメッセージ
  messageKey: string;
  // severity
  severity: "warning" | "error";
};

const defaultClassifyState = (state: number) => {
  if (state === 5) return "error";
  if (state === 4) return "warning";
  return null;
};

const defaultFormatInfo = (info?: string[]) => {
  if (!info || info.length === 0) return "";
  return info.join(" / ");
};

const defaultMakeKey = (n: AnyNode) => {
  const name = "name" in n ? String(n.name ?? "") : "";
  const domain =
    "domain" in n && typeof n.domain === "string"
      ? n.domain
      : ("node" in n && typeof (n as any).node === "string" ? (n as any).node : "default");
  return `${encodeURIComponent(domain)}:${encodeURIComponent(name)}`;
};

/**
 * ノード状態通知
 */
export default function NodeNotification({
  nodes,
  classifyState = defaultClassifyState,
  makeKey = defaultMakeKey,
  formatInfo = defaultFormatInfo,
}: Props) {
  const notifications = useNotifications();

  // 既に開いている通知を管理
  const openRef = React.useRef<Map<string, OpenEntry>>(new Map());

  // アンマウント時に全通知をクローズ
  React.useEffect(() => {
    return () => {
      const openMap = openRef.current;
      for (const [, entry] of openMap) {
        notifications.close(entry.notifKey);
      }
      openMap.clear();
    };
  }, [notifications]);

  React.useEffect(() => {
    const openMap = openRef.current;
    const seenKeys = new Set<string>();

    for (const n of nodes) {
      const key = makeKey(n);
      seenKeys.add(key);

      const stateVal = typeof (n as any).state === "number" ? (n as any).state : Number((n as any).state) || 0;
      const severity = classifyState(stateVal);
      const name = "name" in n ? String(n.name ?? "") : key;
      const infoText = formatInfo((n as any).info);

      const messageKey = infoText ? `${name}\n${infoText}` : `${name}`;

      // 表示用のメッセージ
      const messageNode = (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography component="div" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
          {infoText && (
            <Typography component="div" variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {infoText}
            </Typography>
          )}
        </Box>
      );

      if (severity) {
        const existing = openMap.get(key);

        if (!existing) {
          const notifKey = notifications.show(messageNode, {
            severity,
            key,
          });
          openMap.set(key, { notifKey: String(notifKey), messageKey, severity });
        } else {
          if (existing.messageKey !== messageKey || existing.severity !== severity) {
            notifications.close(existing.notifKey);
            const notifKey = notifications.show(messageNode, {
              severity,
              key,
            });
            openMap.set(key, { notifKey: String(notifKey), messageKey, severity });
          }
        }
      } else {
        const existing = openMap.get(key);
        if (existing) {
          notifications.close(existing.notifKey);
          openMap.delete(key);
        }
      }
    }

    for (const [key, entry] of Array.from(openMap.entries())) {
      if (!seenKeys.has(key)) {
        notifications.close(entry.notifKey);
        openMap.delete(key);
      }
    }
  }, [nodes, notifications, classifyState, makeKey, formatInfo]);

  return null;
}