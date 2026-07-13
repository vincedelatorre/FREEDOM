/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { MAP_Z_INDEX } from "@/components/map/mapZIndex";

interface LocationPanelProps {
  latLng: [number, number] | null; // ←配列形式に変更
  onUpdate: (latLng: [number, number]) => void; // ←更新も配列で渡す
}

export default function LocationPanel({ latLng, onUpdate }: LocationPanelProps) {
  const translate = useTranslations("Config");

  // 入力用のローカル状態
  const [latInput, setLatInput] = useState<string>("");
  const [lngInput, setLngInput] = useState<string>("");

  // 外部から座標が変わったら同期
  useEffect(() => {
    if (latLng) {
      setLatInput(latLng[0].toFixed(6));
      setLngInput(latLng[1].toFixed(6));
    }
  }, [latLng]);

  /** 共通処理: lat/lng を確定 */
  const confirmValue = (type: "lat" | "lng") => {
    if (!latLng) return;
    const [lat, lng] = latLng;
    if (type === "lat") {
      const num = parseFloat(latInput);
      if (!isNaN(num)) {
        onUpdate([num, lng]);
        setLatInput(num.toFixed(6));
      }
    } else {
      const num = parseFloat(lngInput);
      if (!isNaN(num)) {
        onUpdate([lat, num]);
        setLngInput(num.toFixed(6));
      }
    }
  };

  /** Enterキーで確定 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, type: "lat" | "lng") => {
    if (e.key === "Enter") {
      confirmValue(type);
    }
  };

  return (
    <Box
      className="location-panel"
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
        }
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        {translate("location.listTitle")}
      </Typography>

      {!latLng ? (
        <Typography variant="body2" color="text.secondary">
          {translate("location.empty")}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            label={translate("location.table.lat")}
            type="number"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            onBlur={() => confirmValue("lat")}
            onKeyDown={(e) => handleKeyDown(e, "lat")}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label={translate("location.table.lng")}
            type="number"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            onBlur={() => confirmValue("lng")}
            onKeyDown={(e) => handleKeyDown(e, "lng")}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>
      )}
    </Box>
  );
}
