/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme } from "@mui/material/styles";

/** 0..9 に丸め込み */
export function clampMapStatus(status?: number): number {
  const n = Number.isFinite(status) ? Math.trunc(status!) : 0;
  return Math.max(0, Math.min(9, n));
}

/** ステータス色 */
export function getMapStatusColor(theme: Theme, status?: number): string {
  switch (clampMapStatus(status)) {
    case 0: // DISCONNECT
      return theme.palette.grey[400];
    case 1: // WAITING
      return theme.palette.info.main;
    case 2: // MANUAL
      return theme.palette.secondary.main;
    case 3: // ACTIVE
      return theme.palette.success.main;
    case 4: // WARNING
      return theme.palette.warning.main;
    case 5: // ERROR
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
}

/** Chip等に適用する sx（背景＋コントラスト文字色） */
export function getMapStatusChipSx(theme: Theme, status?: number) {
  const bg = getMapStatusColor(theme, status);
  return {
    bgcolor: bg,
    color: theme.palette.getContrastText(bg),
  } as const;
}

/** マーカーの z-index オフセット */
export function getMapStatusZIndexOffset(status?: number): number {
  return clampMapStatus(status) * 100;
}
