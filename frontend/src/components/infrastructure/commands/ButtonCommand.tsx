/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import axios from "@/lib/axios";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";
import { ButtonCommandResponse } from "@/types/infrastructure";
import { CommandProps } from "@/components/infrastructure/commands";

/** 実行ボタンコマンド */
export default function ButtonCommand({
  node,
  domain,
  command,
  disabled,
  onExecuted,
}: CommandProps<ButtonCommandResponse>) {
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const translate = useTranslations("Node.infrastructure.command");

  /** ボタン押下 */
  const handleCommand = async (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    const result = await dialogs.confirm(
      translate("dialog.content", { node: domain?.name ?? "", command: command.label }),
      {
        title: translate("dialog.title"),
        okText: translate("dialog.ok"),
        cancelText: translate("dialog.cancel"),
      },
    );
    if (!result) return;

    try {
      await axios.post(`/node/infrastructure.${node}`, {
        domain,
        func: command.func,
        kwargs: command.kwargs ?? {},
      });
      notifications.show(
        translate("dialog.success", { node: domain?.name ?? "", command: command.label }),
        { severity: "success", autoHideDuration: 3000 },
      );
      await onExecuted?.(command);
    } catch {
      notifications.show(
        translate("dialog.error", { node: domain?.name ?? "", command: command.label }),
        { severity: "error", autoHideDuration: 3000 },
      );
    }
  };

  return (
    <Button
      type="button"
      variant="contained"
      disabled={disabled}
      sx={{ width: { xs: "100%", sm: "fit-content" } }}
      onClick={handleCommand}
      aria-label={`${domain?.name ?? ""} ${command.label}`}
    >
      {command.label}
    </Button>
  );
}
