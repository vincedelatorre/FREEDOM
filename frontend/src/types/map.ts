/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/* -------------------------
   Map 用の型
------------------------- */

/** 地図のマーカー項目 */
export interface NodeMarkerItem {
  /** マーカーID */
  id: string;
  /** ノード名 */
  name: string;
  /** 座標 */
  location: [number, number];
  /** 状態 */
  state?: number;
  /** ドメイン名 */
  domain?: string;
  /** 情報 */
  info?: string[];
}