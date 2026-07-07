/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/** 各ノードのステータス情報 */
export interface NodeStatus {
  /** モジュールパス */
  node?: string;
  /** ノード名 */
  name: string;
  /** 状態 */
  state: number;
  /** 位置情報 */
  location?: [number, number] | null;
  /** 情報 */
  info?: string[];
  /** 詳細情報 */
  detail?: unknown;
  /** ドメイン名 */
  domain?: string;
}
