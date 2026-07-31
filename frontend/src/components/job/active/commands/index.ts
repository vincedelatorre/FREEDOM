/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobActiveResponse, StatementTaskResponse, CommandType, CommandResponseType } from '@/types/job'
import TaskCommand from './TaskCommand';
import TextCommand from './TextCommand';
import ButtonCommand from './ButtonCommand';
import SwitchCommand from './SwitchCommand';

/** 各ジョブコマンド引数
 * @typeParam Type 各設定内容
 */
export interface CommandProps<Type = CommandResponseType> {
  /** ジョブ */
  job: JobActiveResponse
  /** タスク */
  task: StatementTaskResponse
  /** コマンド種類 */
  command: Type
  /** ドメイン更新 */
  onRefresh: () => Promise<void>
  /** 親タスク終了 */
  finished?: boolean
  /** 実行中のタスクID */
  currentTaskId?: string
}

/** 各ジョブコマンド種類とコンポーネントの紐づけ */
export const CommandMap: Record<CommandType, React.ComponentType<any>> = {
  task: TaskCommand,
  button: ButtonCommand,
  switch: SwitchCommand,
  text: TextCommand,
};
