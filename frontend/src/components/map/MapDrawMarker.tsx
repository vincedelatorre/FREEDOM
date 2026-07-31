/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, Point } from "geojson";
import {
  Marker as RglMarker,
  useMap,
  type MarkerDragEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationPanel from "./LocationPanel";

export type MarkerGeoJSON = Feature<Point, { name?: string; rgl_id?: string }>;

interface MapDrawMarkerProps {
  onChange: (marker: MarkerGeoJSON | null) => void;
  initialMarker?: { name?: string; lat: number; lng: number };
  namePrefix?: string; // 例: 「位置」
  color?: string;      // 例: "#1976d2"
  size?: number;       // px
  updatePosition?: (fn: (lat: number, lng: number) => void) => void;
}

export default function MapDrawMarker({
  onChange,
  initialMarker,
  namePrefix = "位置",
  color = "#1976d2",
  size = 36,
  updatePosition,
}: MapDrawMarkerProps) {
  // MapRef を安全に取得（<Map id="main" /> があれば優先）
  const maps = useMap();
  const mapRef: MapRef | undefined = useMemo(() => {
    if ((maps as any).main) return (maps as any).main as MapRef;
    const ids = Object.keys(maps);
    return ids.length ? (maps as any)[ids[0]] as MapRef : undefined;
  }, [maps]);

  // 内部状態：マーカー位置（null=未設置）※ [lng, lat]
  const [pos, setPos] = useState<[number, number] | null>(null);
  const rotatingRef = useRef(false);
  const idRef = useRef<string>(`marker-${Date.now()}`);

  // 初期復元（初回のみ）
  useEffect(() => {
    if (!initialMarker) return;
    const next: [number, number] = [initialMarker.lng, initialMarker.lat];
    setPos(next);
    pushGeoJSON(next, initialMarker.name ?? `${namePrefix} 1`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMarker?.lat, initialMarker?.lng]);

  // 回転中はクリック設置を無効化
  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;
    const onRotateStart = () => (rotatingRef.current = true);
    const onRotateEnd = () => setTimeout(() => (rotatingRef.current = false), 150);
    map.on("rotatestart", onRotateStart);
    map.on("rotateend", onRotateEnd);
    return () => {
      map.off("rotatestart", onRotateStart);
      map.off("rotateend", onRotateEnd);
    };
  }, [mapRef]);

  // 初回から確実にクリックを登録（load/styledata 待ち＋念のためのポーリング）
  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    let disposed = false;
    let attached = false;

    const handler = (e: any) => {
      if (rotatingRef.current) return;
      const target = (e.originalEvent?.target ?? null) as HTMLElement | null;
      if (target && target.closest(".location-panel")) return;

      const { lng, lat } = e.lngLat;
      const next: [number, number] = [lng, lat];
      setPos(next);
      pushGeoJSON(next, `${namePrefix} 1`);
    };

    const attach = () => {
      if (disposed || attached) return;
      map.on("click", handler);
      attached = true;
    };

    if (map.loaded() && map.isStyleLoaded()) {
      attach();
    } else {
      const onLoad = () => attach();
      const onStyle = () => attach();
      map.once("load", onLoad);
      map.once("styledata", onStyle);

      const tick = () => {
        if (disposed || attached) return;
        if (map.loaded() && map.isStyleLoaded()) {
          attach();
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);

      return () => {
        disposed = true;
        try {
          map.off("click", handler);
          map.off("load", onLoad);
          map.off("styledata", onStyle);
        } catch {}
      };
    }

    // 通常のクリーンアップ
    return () => {
      disposed = true;
      try {
        map.off("click", handler);
      } catch {}
    };
  }, [mapRef, namePrefix]);

  // 外部から座標更新
  useEffect(() => {
    if (!updatePosition) return;
    updatePosition((lat: number, lng: number) => {
      const next: [number, number] = [lng, lat];
      setPos(next);
      pushGeoJSON(next, `${namePrefix} 1`);
    });
  }, [updatePosition, namePrefix]);

  // GeoJSON を生成して通知
  function pushGeoJSON(lngLat: [number, number], name: string) {
    const [lng, lat] = lngLat;
    const geoJson: MarkerGeoJSON = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [lng, lat] }, // GeoJSON は [lng, lat]
      properties: { rgl_id: idRef.current, name },
    };
    onChange(geoJson);
  }

  // 右クリック削除
  function handleDelete(ev?: React.MouseEvent) {
    ev?.preventDefault();
    setPos(null);
    onChange(null);
  }

  // マーカー描画（MUI アイコン）
  const markerNode = useMemo(
    () => (
      <div
        className="custom-mui-pin"
        onContextMenu={handleDelete}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          transform: "translateY(2px)",
          cursor: "grab",
        }}
      >
        <LocationOnIcon sx={{ color, fontSize: size }} />
      </div>
    ),
    [color, size]
  );

  // LocationPanel は [lat, lng] で扱う
  const latLng: [number, number] | null = pos ? [pos[1], pos[0]] : null;

  return (
    <>
      {pos && (
        <RglMarker
          longitude={pos[0]}
          latitude={pos[1]}
          anchor="bottom"
          draggable
          onDragEnd={(e: MarkerDragEvent) => {
            const next: [number, number] = [e.lngLat.lng, e.lngLat.lat];
            setPos(next);
            pushGeoJSON(next, `${namePrefix} 1`);
          }}
        >
          {markerNode}
        </RglMarker>
      )}
      <LocationPanel
        latLng={latLng}
        onUpdate={(newLatLng) => {
          const next: [number, number] = [newLatLng[1], newLatLng[0]];
          setPos(next);
          pushGeoJSON(next, `${namePrefix} 1`);
        }}
      />
    </>
  );
}