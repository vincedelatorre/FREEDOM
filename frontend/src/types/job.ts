/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/** ジョブドメイン受信内容 */
export type JobActiveResponse = {
  /** ジョブID */
  id: string
  /** 生成日時 */
  created_at: string
  /** 名称 */
  name: string
  /** ジョブ表示 */
  visible: boolean
  /** タスク内容 */
  task: StatementTaskResponse
  /** タスク変数 */
  variables: VariableResponse[]
  /** タスク実行管理 */
  command: TaskCommandResponse
  /** 異常内容 */
  error_msg: string[]
  /** 警告内容 */
  warning_msg: string[]
};

/** 値タスク内容 */
export interface ValueTaskResponse {
  /** ブロック種類 */
  type: string;
  /** ブロックID */
  id: string;
  /** フィールド値, 出力ブロック, ステートメントブロック のいずれか */
  [key: string]: any | ValueTaskResponse | StatementTaskResponse;
}

/** ステートメントタスク内容 */
export interface StatementTaskResponse extends ValueTaskResponse {
  /** タスク名 */
  name: string;
  /** 次タスク */
  next: StatementTaskResponse | null;
  /** 表示判定 */
  should_show: boolean;
  /** 復帰可能判定 */
  can_recover: boolean;
  /** 終了フラグ */
  finished: boolean;
  /** コマンド内容 */
  command: CommandResponseType[];
}

/** ジョブ変数 */
export interface VariableResponse {
  /** ブロックID */
  id: string;
  /** 名前 */
  name: string;
  /** 型 */
  type: string;
  /** 内容 */
  value: any;
}

/** 各コマンド種類 */
export type CommandType =
  | "task"
  | "button"
  | "switch"
  | "text";

/** 抽象コマンド内容 */
interface BaseCommandResponse {
  /** 各コマンド種類 */
  type: CommandType;
}

/** タスク表示コマンド内容 */
export interface TaskCommandResponse extends BaseCommandResponse {
  /** コマンド種類 */
  type: "task";
  /** 先頭タスクID */
  id: string;
}

/** ボタン表示コマンド内容 */
export interface ButtonCommandResponse extends BaseCommandResponse {
  /** コマンド種類 */
  type: "button";
  /** 表示文字 */
  label: string;
  /** 返却内容 */
  value: any;
}

/** スイッチフォーム内容 */
export interface SwitchCommandResponse extends BaseCommandResponse {
  /** コマンド種類 */
  type: "switch";
  /** ONの表示文字 */
  label_on: string;
  /** OFFの表示文字 */
  label_off: string;
  /** 返却内容 */
  value: boolean;
}

/** 文字表示コマンド内容 */
export interface TextCommandResponse extends BaseCommandResponse {
  /** コマンド種類 */
  type: "text";
  /** 表示文字 */
  label: string;
}

/** 各フォーム内容 */
export type CommandResponseType =
  | TaskCommandResponse
  | ButtonCommandResponse
  | SwitchCommandResponse
  | TextCommandResponse;
