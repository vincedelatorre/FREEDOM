/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandType, CommandResponseType } from "@/types/infrastructure";
import ButtonCommand from "./ButtonCommand";

/** 各インフラコマンド引数
 * @typeParam Type 各コマンド内容
 */
export interface CommandProps<Type = CommandResponseType> {
  /** ノード名 */
  node: string;
  /** ドメイン検索パラメータ */
  domain?: Record<string, any>;
  /** コマンド種類 */
  command: Type;
  /** 無効 */
  disabled?: boolean;
  /** 実行後コールバック */
  onExecuted?: (cmd: CommandResponseType) => void | Promise<void>;
}

/** 各コマンド種類とコンポーネントの紐づけ */
export const CommandMap: Record<CommandType, React.ComponentType<any>> = {
  button: ButtonCommand,
};
