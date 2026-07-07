/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

/** 詳細カード引数 */
export interface DetailCardProps {
  /** 詳細データ */
  detail?: any;
  /** 見出しの上書き */
  title?: string;
}

/** 詳細カード */
export default function DetailCard({ detail, title }: DetailCardProps) {
  const translate = useTranslations("Map.detail");

  const isEmpty = detail == null || (Array.isArray(detail) && detail.length === 0) || (typeof detail === "string" && detail.trim() === "");

  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 } }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
        {title ?? translate("title")}
      </Typography>
      {isEmpty ? (
        <Typography variant="body2" color="text.secondary">
          {translate("none")}
        </Typography>
      ) : Array.isArray(detail) ? (
        <Stack spacing={0.5}>
          {detail.map((msg: any, i: number) => (
            <Typography key={i} variant="body2">
              {String(msg)}
            </Typography>
          ))}
        </Stack>
      ) : typeof detail === "string" ? (
        <Box component="pre" sx={{ m: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {detail}
        </Box>
      ) : (
        <Box component="pre" sx={{ m: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(detail, null, 2)}
        </Box>
      )}
    </Paper>
  );
}
