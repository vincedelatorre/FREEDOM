/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getMapStatusChipSx } from "@/components/map/statusColors";

export type mapStatusChipProps = Omit<ChipProps, "color"> & {
  status?: number;
};

export default function StatusChip({ status, sx, ...rest }: mapStatusChipProps) {
  const theme = useTheme();
  return (
    <Chip
      {...rest}
      sx={{ fontWeight: 700, ...getMapStatusChipSx(theme, status), ...sx }}
    />
  );
}
