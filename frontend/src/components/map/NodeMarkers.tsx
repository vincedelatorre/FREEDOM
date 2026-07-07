/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { memo, useMemo, useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-map-gl/maplibre";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import StatusChip from "@/components/map/StatusChip";
import { clampMapStatus, getMapStatusColor } from "@/components/map/statusColors";
import type { NodeMarkerItem } from "@/types/map";

export interface NodeMarkersProps {
  nodes: NodeMarkerItem[];
  nodeVisibility: { [nodeName: string]: boolean };
  nodeLabelVisibility?: { [nodeName: string]: boolean };
  selectedName?: string | null;
  onMarkerClick?: (name: string) => void;
  centerOnSelect?: boolean;
}

function sanitizeDomain(domain?: string): string {
  return encodeURIComponent(domain?.trim() || "default");
}

const POPUP_MESSAGE_FONT_SIZE_PX = 14;

/** ドメインを "group.type..." に分解 */
function parseDomain(domain?: string): { group?: string; type?: string } {
  const raw = domain?.trim() || "";
  if (!raw) return {};
  const [group, ...rest] = raw.split(".");
  if (!group) return {};
  const type = rest.length ? rest.join(".") : undefined;
  return { group, type };
}

function makeStatusText(
  status: number | undefined,
  domain: string | undefined,
  tMap: (key: string) => string,
  tInfra: (key: string) => string,
  tEquipment: (key: string) => string,
  tRobot: (key: string) => string
): string {
  const code = clampMapStatus(status);
  const { group, type } = parseDomain(domain);

  if (group === "infrastructure" && type) {
    const key = `${type}.state.${code}`;
    const text = tInfra(key);
    if (text && text !== key) return text;
  }
  if (group === "equipment" && type) {
    const key = `${type}.state.${code}`;
    const text = tEquipment(key);
    if (text && text !== key) return text;
  }
  if (group === "robot" && type) {
    const key = `${type}.state.${code}`;
    const text = tRobot(key);
    if (text && text !== key) return text;
  }
  return tMap(`state.${code}`);
}

function useAvailableIconUrlSet() {
  const [iconUrlSet, setIconUrlSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        const res = await fetch("/api/files/icons", { cache: "no-store" });
        if (!res.ok) return;
        const files: string[] = await res.json();
        if (disposed) return;

        const next = new Set<string>();
        for (const file of files) {
          next.add(`/icons/${file}`);
          next.add(`/icons/${encodeURIComponent(file)}`);
        }
        setIconUrlSet(next);
      } catch {
        // アイコン一覧が取得できなかったらフォールバック
      }
    })();

    return () => {
      disposed = true;
    };
  }, []);

  return iconUrlSet;
}

/** フォールバックのピン（JSX 版） */
function DefaultPinSVG({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="44"
      viewBox="0 0 40 44"
      role="img"
      aria-label="default-marker"
    >
      <path
        d="M20 2 C11 2 4 9 4 18 C4 28 20 42 20 42 C20 42 36 28 36 18 C36 9 29 2 20 2 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle cx="20" cy="18" r="6" fill="#ffffff" />
    </svg>
  );
}

function MarkerVisual({
  imgUrl,
  color,
  name,
  showLabel,
}: {
  imgUrl?: string;
  color: string;
  name: string;
  showLabel: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: 40,
        height: 40,
        overflow: "visible",
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="marker"
            width={40}
            height={40}
            style={{ display: "block", objectFit: "contain" }}
            draggable={false}
          />
        ) : (
          <DefaultPinSVG color={color} />
        )}
      </div>
      {showLabel && (
        <span
          style={{
            position: "absolute",
            left: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: 1,
            color,
            fontSize: 14,
            fontWeight: 600,
            WebkitTextStroke: "2px #fff",
            paintOrder: "stroke fill",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          ◀{name}
        </span>
      )}
    </div>
  );
}

type NodeMarkerProps = {
  name: string;
  lat: number;
  lng: number;
  status?: number;
  domain?: string;
  info?: string[];
  showLabel?: boolean;
  onClick?: (name: string) => void;
  iconUrlSet: Set<string>;
};

const NodeMarker = memo(function NodeMarker({
  name, lat, lng, status, domain, info, showLabel = true, onClick, iconUrlSet,
}: NodeMarkerProps) {
  const theme = useTheme();
  const tMap = useTranslations("Map");
  const tInfra = useTranslations("Node.infrastructure");
  const tEquipment = useTranslations("Node.equipment");
  const tRobot = useTranslations("Node.robot");

  const primaryBase = useMemo(() => {
    return `/icons/${sanitizeDomain(domain)}.${clampMapStatus(status)}`;
  }, [domain, status]);

  const primaryUrl = useMemo(() => {
    const prefix = `${primaryBase}.`;
    for (const url of iconUrlSet) {
      if (url.startsWith(prefix)) return url;
    }
    return null;
  }, [primaryBase, iconUrlSet]);

  // ラベル色（ステータスに応じて）
  const statusColor = useMemo(() => getMapStatusColor(theme, status), [theme, status]);


  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const open = hoverOpen || pinnedOpen;

  const statusText = makeStatusText(status, domain, tMap, tInfra, tEquipment, tRobot);

  return (
    <>
      <Marker
        longitude={lng}
        latitude={lat}
        anchor="center"
        style={{ cursor: "pointer" }}
        onClick={(e:any) => {
          e.originalEvent.stopPropagation();
          onClick?.(name);
          setPinnedOpen((s) => !s);
        }}
      >
        <div
          onMouseEnter={() => setHoverOpen(true)}
          onMouseLeave={() => setHoverOpen(false)}
          aria-label={`marker:${name}`}
        >
          <MarkerVisual
            imgUrl={primaryUrl ?? undefined}
            color={statusColor}
            name={name}
            showLabel={showLabel}
          />
        </div>
      </Marker>

      {open && (
        <Popup
          longitude={lng}
          latitude={lat}
          anchor="bottom"
          closeButton={true}
          closeOnClick={false}
          closeOnMove={false}
          maxWidth="280px"
          offset={[0, -8]}
          onClose={() => setPinnedOpen(false)}
        >
          <StatusChip label={statusText} status={status} size="small" />
          <div style={{ marginTop: 4, fontSize: POPUP_MESSAGE_FONT_SIZE_PX, lineHeight: 1.5 }}>
            {info && info.length ? (
              <ul style={{ listStyle:"none", paddingLeft: 0, margin: 0 }}>
                {info.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              <div>-</div>
            )}
          </div>
        </Popup>
      )}
    </>
  );
});

export default function MapNodeMarkers({
  nodes,
  nodeVisibility,
  nodeLabelVisibility,
  selectedName,
  onMarkerClick,
  centerOnSelect = true,
}: NodeMarkersProps) {
  const { current: map } = useMap();
  const iconUrlSet = useAvailableIconUrlSet();

  const sortedNodesByName = useMemo(
    () => [...nodes].sort((a, b) => a.name.localeCompare(b.name)),
    [nodes]
  );

  const visibleNodes = useMemo(() => {
    return sortedNodesByName.filter((node) => {
      const visible = !!nodeVisibility[node.name];
      const [lat, lng] = node.location;
      const locOk = Number.isFinite(lat) && Number.isFinite(lng);
      const idOk = typeof node.id === "string" && node.id.length > 0;
      const nameOk = typeof node.name === "string" && node.name.length > 0;
      return visible && locOk && idOk && nameOk;
    });
  }, [sortedNodesByName, nodeVisibility]);

  useEffect(() => {
    if (!selectedName || !centerOnSelect || !map) return;
    const found = visibleNodes.find(n => n.name === selectedName) || sortedNodesByName.find(n => n.name === selectedName);
    if (!found) return;
    const [lat, lng] = found.location;
    const mapObj = map.getMap();
    const current = mapObj.getCenter();
    const dx = current.lng - lng;
    const dy = current.lat - lat;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.00005) return;

    try {
      map.flyTo({ center: [lng, lat], duration: 200 });
    } catch {
      map.setCenter([lng, lat]);
    }
  }, [selectedName, centerOnSelect, visibleNodes, sortedNodesByName, map]);

  return (
    <>
      {visibleNodes.map((node) => {
        const [lat, lng] = node.location;
        const showLabel = nodeLabelVisibility?.[node.name] !== false;
        return (
          <NodeMarker
            key={node.id}
            name={node.name}
            lat={lat}
            lng={lng}
            status={node.state}
            domain={node.domain}
            info={node.info}
            showLabel={showLabel}
            onClick={onMarkerClick}
            iconUrlSet={iconUrlSet}
          />
        );
      })}
    </>
  );
}
