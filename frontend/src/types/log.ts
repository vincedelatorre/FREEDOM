/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LogEntry {
  time: string;       // ISO 8601 の日時文字列
  name: string;
  levelname: string;
  message: string;
  [key: string]: any;
}