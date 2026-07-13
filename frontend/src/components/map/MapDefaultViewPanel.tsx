/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { MAP_Z_INDEX } from "@/components/map/mapZIndex";

export interface MapDefaultViewPanelValue {
  lat: number;
  lng: number;
  zoom: number;
  rotation: number;
}

interface MapDefaultViewPanelProps {
  value: MapDefaultViewPanelValue | null;
  onUpdate: (value: MapDefaultViewPanelValue) => void;
}

export default function MapDefaultViewPanel({
  value,
  onUpdate,
}: MapDefaultViewPanelProps) {
  const translate = useTranslations("Config");

  // 入力用ローカル state（LocationPanel と同様）
  const [latInput, setLatInput] = useState<string>("");
  const [lngInput, setLngInput] = useState<string>("");
  const [zoomInput, setZoomInput] = useState<string>("");
  const [rotationInput, setRotationInput] = useState<string>("");

  /** 外部 value が変わったら同期 */
  useEffect(() => {
    if (!value) return;
    setLatInput(value.lat.toFixed(6));
    setLngInput(value.lng.toFixed(6));
    setZoomInput(String(value.zoom));
    setRotationInput(value.rotation.toFixed(2));
  }, [value]);

  /** 数値 input の増減操作（ホイール／↑↓）を無効化 */
  const disableNumberAdjust = (
    e: React.KeyboardEvent<HTMLDivElement> | React.WheelEvent
  ) => {
    // マウスホイール
    if ("deltaY" in e) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
      return;
    }

    // キーボード（↑ ↓）
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  /** 値確定処理 */
  const confirm = () => {
    if (!value) return;

    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    const zoom = parseFloat(zoomInput);
    const rotation = parseFloat(rotationInput);

    if ([lat, lng, zoom, rotation].some((v) => isNaN(v))) {
      return;
    }

    onUpdate({
      lat,
      lng,
      zoom,
      rotation,
    });
  };

  /** Enterキーで確定 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      confirm();
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        width: { xs: 250, sm: 340 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        p: 1,
        zIndex: MAP_Z_INDEX.UI_OVERLAY,
        borderRadius: 1,
        boxShadow: 1,
        "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        {translate("defaultView.listTitle")}
      </Typography>

      {!value ? (
        <Typography variant="body2" color="text.secondary">
          {translate("defaultView.empty")}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {/* 緯度・経度 */}
          <Stack direction="row" spacing={1}>
            <TextField
              label={translate("defaultView.table.lat")}
              type="number"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              onBlur={confirm}
              onKeyDown={(e) => {
                disableNumberAdjust(e);
                handleKeyDown(e);
              }}
              onWheel={disableNumberAdjust}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label={translate("defaultView.table.lng")}
              type="number"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              onBlur={confirm}
              onKeyDown={(e) => {
                disableNumberAdjust(e);
                handleKeyDown(e);
              }}
              onWheel={disableNumberAdjust}
              size="small"
              sx={{ flex: 1 }}
            />
          </Stack>

          {/* 回転角度 */}
          <TextField
            label={translate("defaultView.table.rotation")}
            type="number"
            value={rotationInput}
            onChange={(e) => setRotationInput(e.target.value)}
            onBlur={confirm}
            onKeyDown={(e) => {
              disableNumberAdjust(e);
              handleKeyDown(e);
            }}
            onWheel={disableNumberAdjust}
            size="small"
          />

          {/* ズームレベル */}
          <TextField
            label={translate("defaultView.table.zoomLevel")}
            type="number"
            value={zoomInput}
            onChange={(e) => setZoomInput(e.target.value)}
            onBlur={confirm}
            onKeyDown={(e) => {
              disableNumberAdjust(e);
              handleKeyDown(e);
            }}
            onWheel={disableNumberAdjust}
            size="small"
          />
        </Stack>
      )}
    </Box>
  );
}
