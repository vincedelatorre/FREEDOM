/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import type * as maplibregl from "maplibre-gl";
import { MAP_MARKER_PRIORITY, MAP_Z_INDEX } from "@/components/map/mapZIndex";

export function getDomainTier(group?: string): number {
  if (group === "robot") return 3;
  if (group === "equipment") return 2;
  if (group === "infrastructure") return 1;
  return 0;
}

export function clampMapStatusTier(status?: number): number {
  const n = Number.isFinite(status) ? Math.trunc(status as number) : 0;
  if (n >= 1 && n <= 5) return n;
  return 0;
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function computeNodeMarkerPriority(params: {
  map: maplibregl.Map;
  lng: number;
  lat: number;
  group?: string;
  status?: number;
  name: string;
}): number {
  const { map, lng, lat, group, status, name } = params;

  const domainTier = getDomainTier(group);
  const statusTier = clampMapStatusTier(status);
  const fixedPriority =
    MAP_Z_INDEX.MARKER +
    domainTier * MAP_MARKER_PRIORITY.DOMAIN_STEP +
    statusTier * MAP_MARKER_PRIORITY.STATUS_STEP;

  const p = map.project([lng, lat]);
  const h = Math.max(1, map.getContainer().clientHeight || 1);
  const yBuckets = Math.max(1, MAP_MARKER_PRIORITY.Y_BUCKETS);
  const normalizedY = Math.max(0, Math.min(0.999999, p.y / h));
  const yRank = Math.floor(normalizedY * yBuckets);

  const tieBreaker = hashName(name) % MAP_MARKER_PRIORITY.NAME_TIE_BREAKER_MOD;
  const yAndTie = yRank * MAP_MARKER_PRIORITY.NAME_TIE_BREAKER_MOD + tieBreaker;

  return fixedPriority + yAndTie;
}

export function getNodeMarkerPriorityCeiling(): number {
  const maxDomainTier = 3;
  const maxStatusTier = 5;
  const maxYAndTie =
    (Math.max(1, MAP_MARKER_PRIORITY.Y_BUCKETS) - 1) *
      MAP_MARKER_PRIORITY.NAME_TIE_BREAKER_MOD +
    (MAP_MARKER_PRIORITY.NAME_TIE_BREAKER_MOD - 1);

  return (
    MAP_Z_INDEX.MARKER +
    maxDomainTier * MAP_MARKER_PRIORITY.DOMAIN_STEP +
    maxStatusTier * MAP_MARKER_PRIORITY.STATUS_STEP +
    maxYAndTie
  );
}

export function getNodePopupPriorityBase(): number {
  return getNodeMarkerPriorityCeiling() - MAP_Z_INDEX.MARKER + 1;
}
