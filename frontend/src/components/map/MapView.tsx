/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "@/lib/axios";
import Map, { MapRef, Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapImage, { ImageResponse } from '@/components/map/MapImage'
import { MAP_Z_INDEX } from "@/components/map/mapZIndex";

const normalizeDeg = (deg: number) => ((deg % 360) + 360) % 360;
const EMPTY_STYLE = { version: 8, sources: {}, layers: []} as const satisfies StyleSpecification;

interface DefaultViewResponse {
  center: [number, number]
  zoom: number
  rotate: number
}

export interface MapResponse {
  default_view: DefaultViewResponse
  image_list: ImageResponse[]
}

interface Props {
  center?: [number, number]
  zoom?: number
  rotate?: number
  images?: ImageResponse[]
  onCenterChange?: (center: { lat: number; lng: number }) => void;
  onZoomChange?: (zoom: number) => void;
  onRotateChange?: (rotate: number) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onMapClick?: () => void;
};

type BaseLayerId = "osm" | "gsi_std" | "gsi_ort";

export default function MapView(props: Props) {
  const [ mapResponse, setMapResponse ] = useState<MapResponse>();
  const [base, setBase] = useState<BaseLayerId>("osm");
  const mapLibPromise = useMemo(() => import("maplibre-gl"), []);
  const centerLL = useMemo(() => {
    const src = props.center ?? mapResponse?.default_view.center;
    if (!src) return undefined;
    const [lat, lng] = src;
    return { lon: lng, lat }; // MapLibre は [lng, lat] 順
  }, [props.center, mapResponse?.default_view.center]);

  const zoom: number | undefined = useMemo(
    () => props.zoom ?? mapResponse?.default_view.zoom,
    [props.zoom, mapResponse?.default_view.zoom]
  );
  const bearing: number | undefined = useMemo(
    () => (props.rotate && normalizeDeg(props.rotate)) ?? mapResponse?.default_view.rotate,
    [props.rotate, mapResponse?.default_view.rotate]
  );
  const images: ImageResponse[] | undefined = useMemo(
    () => props.images ?? mapResponse?.image_list,
    [props.images, mapResponse?.image_list]
  );
  const isLoading = () => (centerLL === undefined || zoom === undefined || bearing === undefined);

  useEffect(() => {
    if (!(isLoading() || images === undefined)) {
      return
    }
    const run = () => {
      axios.post<MapResponse[]>("/domain/freedom.map")
        .then(res => setMapResponse(res.data[0]))
        .catch(() => {
          setTimeout(() => {
            run();
          }, 5000)
        })
    }
    run();
  }, [])

  const mapRef = useRef<MapRef | null>(null);
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || centerLL === undefined || zoom === undefined || bearing === undefined) return;
    const toCenter = { lng: centerLL.lon, lat: centerLL.lat };
    map.jumpTo({ center: toCenter, zoom, bearing });
  }, [centerLL, zoom, bearing]);

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const c = map.getCenter();
    props.onCenterChange?.({ lat: c.lat, lng: c.lng });
    props.onZoomChange?.(map.getZoom());
    props.onRotateChange?.(Math.round(map.getBearing()));
  }, [props.onCenterChange, props.onZoomChange, props.onRotateChange]);

  if (isLoading()) {
    return (
      <Typography>Loading...</Typography>
    )
  }

  const layerVisibility = (id: BaseLayerId) => (base === id ? "visible" : "none");
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        ...props.style,
        zIndex: 0,
        isolation: "isolate",
        "& .maplibregl-marker": {
          zIndex: MAP_Z_INDEX.MARKER,
        },
        "& .maplibregl-popup": {
          zIndex: MAP_Z_INDEX.POPUP,
        },
        "& .maplibregl-control-container": {
          zIndex: MAP_Z_INDEX.UI_OVERLAY + 1,
        },
        "& .maplibregl-ctrl-top-left, & .maplibregl-ctrl-top-right, & .maplibregl-ctrl-bottom-left, & .maplibregl-ctrl-bottom-right": {
          zIndex: MAP_Z_INDEX.UI_OVERLAY + 1,
        },
        "& .maplibregl-ctrl-group": {
          zIndex: MAP_Z_INDEX.UI_OVERLAY + 1,
        },
      }}
    >
      {/* ベースレイヤ切替（簡易 UI） */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: MAP_Z_INDEX.UI_OVERLAY,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: 1,
          p: 0.5,
        }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={base}
          onChange={(_, v: BaseLayerId) => v && setBase(v)}
        >
          <ToggleButton value="osm">OpenStreetMap</ToggleButton>
          <ToggleButton value="gsi_std">地理院</ToggleButton>
          <ToggleButton value="gsi_ort">航空写真</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Map
        ref={mapRef}
        mapLib={mapLibPromise}
        initialViewState={{
          longitude: centerLL!.lon,
          latitude: centerLL!.lat,
          zoom: zoom!,
          bearing: bearing!,
          pitch: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={EMPTY_STYLE}
        onMoveEnd={handleMoveEnd}
        onZoomEnd={handleMoveEnd}
        onRotateEnd={handleMoveEnd}
        onClick={() => props.onMapClick?.()}

        pitchWithRotate={false}
        touchPitch={false}
        maxPitch={0}
        onLoad={() => {
          const map = mapRef.current?.getMap();
          map?.setPitch(0);
          map?.setMaxPitch(0);
        }}
        onPitchEnd={() => {
          const map = mapRef.current?.getMap();
          if (map && map.getPitch() !== 0) map.setPitch(0);
        }}
      >
        <NavigationControl
          position="top-left"
          showZoom
          showCompass
          visualizePitch={false}
        />
        <Source
          id="osm-src"
          type="raster"
          tiles={["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".replace("{s}", "a")]}
          minzoom={0}
          maxzoom={19}
          tileSize={256}
          attribution="© OpenStreetMap contributors"
        />
        <Layer
          id="osm-layer"
          type="raster"
          source="osm-src"
          layout={{ visibility: layerVisibility("osm") }}
        />
        {/* 地理院 標準 */}
        <Source
          id="gsi-std-src"
          type="raster"
          tiles={["https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"]}
          minzoom={0}
          maxzoom={18}
          tileSize={256}
          attribution="© 国土地理院"
        />
        <Layer
          id="gsi-std-layer"
          type="raster"
          source="gsi-std-src"
          layout={{ visibility: layerVisibility("gsi_std") }}
        />
        {/* 地理院 航空写真 */}
        <Source
          id="gsi-ort-src"
          type="raster"
          tiles={["https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg"]}
          minzoom={0}
          maxzoom={18}
          tileSize={256}
          attribution="© 国土地理院"
        />
        <Layer
          id="gsi-ort-layer"
          type="raster"
          source="gsi-ort-src"
          layout={{ visibility: layerVisibility("gsi_ort") }}
        />

        <Source
          id="overlay-anchor-src"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [],
          }}
        />
        <Layer
          id="overlay-anchor-layer"
          type="line"
          source="overlay-anchor-src"
          layout={{ visibility: "visible" }}
          paint={{
            "line-opacity": 0,
            "line-width": 0,
          }}
        />

        {(images ?? []).map((img, i, arr) => (
          <MapImage
            key={`${img.name}.${i}`}
            id={`${img.name}.${i}`}
            name={img.name}
            corners={img.corners}
            visible={img.visible !== false}
            editable={false}
            beforeId={i === 0 ? "overlay-anchor-layer" : `img-layer-${arr[i - 1].name}.${i - 1}`}
          />
        ))}
        {props.children}
      </Map>
    </Box>
  );
}
