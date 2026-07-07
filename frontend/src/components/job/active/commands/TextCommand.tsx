/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { Typography } from '@mui/material';
import { TextCommandResponse } from '@/types/job';
import { CommandProps } from "@/components/job/active/commands";


/** ジョブ実行テキスト表示コマンド */
export default function TextCommand({
  command
}: CommandProps<TextCommandResponse>) {
  return (
    <Typography>
      {command.label}
    </Typography>
  )
}
