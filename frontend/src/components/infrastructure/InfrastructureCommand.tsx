/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { CommandMap, CommandProps } from "@/components/infrastructure/commands";
import { CommandResponseType } from "@/types/infrastructure";

/** インフラコマンド引数 */
export interface InfrastructureCommandProps {
  /** ノード名 */
  node: string;
  /** ドメイン検索パラメータ */
  domain?: Record<string, any>;
  /** コマンド一覧 */
  commands?: CommandResponseType[];
  /** 全体無効化
   * @defaultValue false
   */
  disabled?: boolean;
  /** 親での取得中表示フラグ
   * @defaultValue false
   */
  loading?: boolean;
  /** 空時プレースホルダー表示
   * @defaultValue false
   */
  showEmptyPlaceholder?: boolean;
  /** 読み込み中プレースホルダー表示
   * @defaultValue false
   */
  showLoadingPlaceholder?: boolean;
  /** 実行後コールバック */
  onExecuted?: (cmd: CommandResponseType) => void | Promise<void>;
}

/** インフラコマンドコンテナ */
export default function InfrastructureCommand({
  node,
  domain,
  commands = [],
  disabled = false,
  loading = false,
  showEmptyPlaceholder = false,
  showLoadingPlaceholder = false,
  onExecuted,
}: InfrastructureCommandProps) {
  const translate = useTranslations("Node.infrastructure.command");

  /** 取得中表示 */
  if (loading) {
    return showLoadingPlaceholder ? (
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    ) : null;
  }

  /** コマンドが存在しない場合 */
  if (!commands || commands.length === 0) {
    return showEmptyPlaceholder ? (
      <Typography variant="body2" color="text.secondary">{translate("noCommands")}</Typography>
    ) : null;
  }

  /** コマンド表示 */
  return (
    <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ flexWrap: { xs: "nowrap", sm: "wrap" } }}>
      {commands.map((cmd, idx) => {
        const CommandComponent = CommandMap[cmd.type];
        if (!CommandComponent) return null;
        const props: CommandProps = {
          node,
          domain,
          command: cmd,
          disabled,
          onExecuted,
        };
        return <CommandComponent key={`${cmd.type}-${idx}`} {...props} />;
      })}
    </Stack>
  );
}
