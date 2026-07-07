/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";

/** 情報カード引数 */
export interface InfoCardProps {
  /** 情報メッセージ配列 */
  info?: string[];
  /** 見出しの上書き */
  title?: string;
}

/** 情報カード */
export default function InfoCard({ info, title }: InfoCardProps) {
  const translate = useTranslations("Map.info");

  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 } }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
        {title ?? translate("title")}
      </Typography>
      {info && info.length ? (
        <Box>
          {info.map((msg, i) => (
            <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>{msg}</Typography>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">{translate("none")}</Typography>
      )}
    </Paper>
  );
}
