/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React from "react";
import { ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

interface IntersectionAreaModeToggleProps {
  selectedMode: "entry" | "reserve";
  onChange: (mode: "entry" | "reserve") => void;
}

export default function IntersectionAreaModeToggle({
  selectedMode,
  onChange,
}: IntersectionAreaModeToggleProps) {
  const translate = useTranslations("Config");

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        padding: 0.3,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        backgroundColor: "#fff",
      }}
    >
      <ToggleButtonGroup
        value={selectedMode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode) onChange(newMode);
        }}
        sx={{ display: "flex", width: "100%", height: "100%" }}
      >
        {/*  進入エリア作成 → primary */}
        <ToggleButton
          value="entry"
          color="primary" //  MUIテーマのprimaryカラーを使用
          sx={{
            flex: 1,
            "&:not(.Mui-selected)": {
              backgroundColor: "#fff", // 非選択時の背景
              color: "#000",           // 非選択時の文字色
            },
            "&:not(.Mui-selected):hover": {
              backgroundColor: "#eeeeee", // 選択中ホバー時はgrayに
            },
          }}
        >
          {translate("intersection.entryCreate")}
        </ToggleButton>

        {/*  予約エリア作成 → warning */}
        <ToggleButton
          value="reserve"
          color="warning" //  MUIテーマのwarningカラーを使用
          sx={{
            flex: 1,
            "&:not(.Mui-selected)": {
              backgroundColor: "#fff", // 非選択時の背景
              color: "#000",           // 非選択時の文字色
            },
            "&:not(.Mui-selected):hover": {
              backgroundColor: "#eeeeee", // 選択中ホバー時はgrayに
            },
          }}
        >
          {translate("intersection.reserveCreate")}
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
}
