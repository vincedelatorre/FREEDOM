/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import { Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import InfrastructureCommand from "@/components/infrastructure/InfrastructureCommand";
import { CommandResponseType } from "@/types/infrastructure";

/** 手動操作カード引数 */
export interface CommandCardProps {
  /** ノード名 */
  node: string;
  /** ドメイン検索パラメータ */
  domain?: Record<string, any>;
  /** コマンド一覧 */
  commands?: CommandResponseType[];
  /** 一括無効化 */
  disabled?: boolean;
  /** 取得中フラグ */
  loading?: boolean;
  /** 空時プレースホルダー表示 */
  showEmptyPlaceholder?: boolean;
  /** 読み込み中プレースホルダー表示 */
  showLoadingPlaceholder?: boolean;
  /** 実行後コールバック */
  onExecuted?: (cmd: CommandResponseType) => void | Promise<void>;
  /** 見出しの上書き */
  title?: string;
}

/** 手動操作カード */
export default function CommandCard({
  node,
  domain,
  commands = [],
  disabled = false,
  loading = false,
  showEmptyPlaceholder = true,
  showLoadingPlaceholder = true,
  onExecuted,
  title,
}: CommandCardProps) {
  const translate = useTranslations("Node.infrastructure.command");

  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 } }} elevation={3}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
        {title ?? translate("manualOption")}
      </Typography>

      <InfrastructureCommand
        node={node}
        domain={domain}
        commands={commands}
        disabled={disabled}
        loading={loading}
        showEmptyPlaceholder={showEmptyPlaceholder}
        showLoadingPlaceholder={showLoadingPlaceholder}
        onExecuted={onExecuted}
      />
    </Paper>
  );
}
