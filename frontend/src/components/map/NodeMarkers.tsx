/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { memo, useMemo, useEffect, useState, useCallback } from "react";
import { Popup, useMap } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import StatusChip from "@/components/map/StatusChip";
import { clampMapStatus, getMapStatusColor } from "@/components/map/statusColors";
import { MAP_Z_INDEX } from "@/components/map/mapZIndex";
import { computeNodeMarkerPriority, getNodePopupPriorityBase } from "@/components/map/mapPriority";
import type { GetFolderFilesResponse } from "@/types/api/files";
import type { NodeMarkerItem } from "@/types/map";

export interface NodeMarkersProps {
  nodes: NodeMarkerItem[];
  nodeVisibility: { [nodeName: string]: boolean };
  nodeLabelVisibility?: { [nodeName: string]: boolean };
  selectedName?: string | null;
  onMarkerClick?: (name: string) => void;
  centerOnSelect?: boolean;
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
        const data: GetFolderFilesResponse = await res.json();
        if (disposed) return;

        const next = new Set<string>();
        for (const file of data.files) {
          next.add(file.filename);
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
  const [ primaryUrl, setPrimaryUrl ] = useState<string | null>(null);
  const theme = useTheme();
  const { current: mapRef } = useMap();
  const tMap = useTranslations("Map");
  const tInfra = useTranslations("Node.infrastructure");
  const tEquipment = useTranslations("Node.equipment");
  const tRobot = useTranslations("Node.robot");

  const primaryBase = useMemo(() => {
    return `${domain}.${clampMapStatus(status)}`;
  }, [domain, status]);

  useEffect(() => {
    const prefix = `${primaryBase}.`;
    for (const url of iconUrlSet) {
      if (url.startsWith(prefix)) {
        (async () => {
          try {
            const res = await fetch(`/api/files/icons/${url}`);
            if (!res.ok) return;
            setPrimaryUrl(URL.createObjectURL(await res.blob()));
          } catch (error) {
            console.error(error);
          }
          return;
        })();
        return;
      }
    }
    setPrimaryUrl(null);
    return () => {
      if (primaryUrl) URL.revokeObjectURL(primaryUrl);
    };
  }, [primaryBase, iconUrlSet]);

  // ラベル色
  const { group } = useMemo(() => parseDomain(domain), [domain]);
  const statusColor = useMemo(() => getMapStatusColor(theme, status), [theme, status]);
  const statusText = makeStatusText(status, domain, tMap, tInfra, tEquipment, tRobot);
  const popupClassName = useMemo(
    () => `node-popup-${encodeURIComponent(name).replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    [name]
  );
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const open = hoverOpen || pinnedOpen;
  const popupPriorityBase = useMemo(() => getNodePopupPriorityBase(), []);

  const computeMarkerPriority = useCallback((map: maplibregl.Map) => {
    return computeNodeMarkerPriority({ map, lng, lat, group, status, name });
  }, [group, status, lng, lat, name]);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    let markerEl: HTMLElement | undefined;
    if (primaryUrl) {
      markerEl = document.createElement("div");
      markerEl.style.cssText = "width:40px;height:40px;overflow:visible";
      const img = document.createElement("img");
      img.src = primaryUrl;
      img.width = 40;
      img.height = 40;
      img.draggable = false;
      img.style.cssText = "display:block;object-fit:contain";
      markerEl.appendChild(img);
    }

    const marker = new maplibregl.Marker({
      element: markerEl,
      color: primaryUrl ? undefined : statusColor,
      anchor: primaryUrl ? "center" : "bottom",
      offset: primaryUrl ? [0, 0] : [0, 6],
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const el = marker.getElement();
    el.style.cursor = "pointer";

    if (showLabel) {
      el.style.overflow = "visible";
      const label = document.createElement("span");
      label.style.cssText = `position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:4px;color:${statusColor};font-size:14px;font-weight:600;-webkit-text-stroke:2px #fff;paint-order:stroke fill;white-space:nowrap`;
      label.textContent = `◀${name}`;
      el.appendChild(label);
    }

    const updateMarkerZIndex = () => {
      el.style.zIndex = String(computeMarkerPriority(map));
    };
    updateMarkerZIndex();

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      onClick?.(name);
      setPinnedOpen((s) => !s);
    };
    const handleEnter = () => setHoverOpen(true);
    const handleLeave = () => setHoverOpen(false);

    el.addEventListener("click", handleClick);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    map.on("move", updateMarkerZIndex);
    map.on("rotate", updateMarkerZIndex);
    map.on("pitch", updateMarkerZIndex);
    map.on("zoom", updateMarkerZIndex);
    map.on("resize", updateMarkerZIndex);

    return () => {
      el.removeEventListener("click", handleClick);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      map.off("move", updateMarkerZIndex);
      map.off("rotate", updateMarkerZIndex);
      map.off("pitch", updateMarkerZIndex);
      map.off("zoom", updateMarkerZIndex);
      map.off("resize", updateMarkerZIndex);
      marker.remove();
    };
  }, [mapRef, statusColor, primaryUrl, name, onClick, showLabel, computeMarkerPriority, lng, lat]);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map || !open) return;

    const escapedPopupClassName =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(popupClassName)
        : popupClassName;

    const updatePopupZIndex = () => {
      const popupEl = map
        .getContainer()
        .querySelector<HTMLElement>(`.maplibregl-popup.${escapedPopupClassName}`);
      if (!popupEl) return false;

      popupEl.style.zIndex = String(
        computeMarkerPriority(map) + popupPriorityBase + MAP_Z_INDEX.POPUP_FROM_MARKER_OFFSET
      );
      return true;
    };

    const rafIds: number[] = [];
    const enqueueRetry = () => {
      rafIds.push(requestAnimationFrame(() => void updatePopupZIndex()));
    };

    let observer: MutationObserver | null = null;
    if (!updatePopupZIndex()) {
      observer = new MutationObserver(() => {
        if (updatePopupZIndex() && observer) {
          observer.disconnect();
          observer = null;
        }
      });
      observer.observe(map.getContainer(), { childList: true, subtree: true });
    }
    enqueueRetry();
    enqueueRetry();

    map.on("move", updatePopupZIndex);
    map.on("rotate", updatePopupZIndex);
    map.on("pitch", updatePopupZIndex);
    map.on("zoom", updatePopupZIndex);
    map.on("resize", updatePopupZIndex);

    return () => {
      if (observer) observer.disconnect();
      rafIds.forEach((id) => cancelAnimationFrame(id));
      map.off("move", updatePopupZIndex);
      map.off("rotate", updatePopupZIndex);
      map.off("pitch", updatePopupZIndex);
      map.off("zoom", updatePopupZIndex);
      map.off("resize", updatePopupZIndex);
    };
  }, [mapRef, open, popupClassName, computeMarkerPriority, popupPriorityBase]);

  return open ? (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      closeButton={true}
      closeOnClick={false}
      closeOnMove={false}
      maxWidth="280px"
      className={popupClassName}
      offset={[0, primaryUrl ? -20 : -40]}
      onClose={() => setPinnedOpen(false)}
    >
      <StatusChip label={statusText} status={status} size="small" />
      <div style={{ marginTop: 4, fontSize: POPUP_MESSAGE_FONT_SIZE_PX, lineHeight: 1.5 }}>
        {info && info.length ? (
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {info.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        ) : (
          <div>-</div>
        )}
      </div>
    </Popup>
  ) : null;
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
