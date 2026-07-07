/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/** 各コマンド種類 */
export type CommandType =
  | "button";

/** 抽象コマンド内容 */
interface BaseCommandResponse {
  /** 各コマンド種類 */
  type: CommandType;
}

/** ボタン表示コマンド内容 */
export interface ButtonCommandResponse extends BaseCommandResponse {
  /** コマンド種類 */
  type: "button";
  /** 表示文字 */
  label: string;
  /** 実行メソッド名 */
  func: string;
  /** メソッドのキーワード引数 */
  kwargs?: Record<string, any>;
}

/** 各コマンド内容 */
export type CommandResponseType =
  | ButtonCommandResponse;
