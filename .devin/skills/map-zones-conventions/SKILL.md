---
name: map-zones-conventions
description: Conventions for FREEDOM's MapLibre map — coordinate order, marker z-index/domain tiers, status codes/colors, area (zone) polygons, and image overlays. Use when touching frontend/src/components/map or any code that produces/consumes map geometry.
---

# Map & Zones Conventions

Applies to `frontend/src/components/map/**` and anything exchanging coordinates with the backend.

## Coordinate order (the #1 source of bugs)

- API/backend and UI data models use **`[lat, lng]`**: `Area.vertex_list`, `NodeMarkerItem.location`, `MapImage` `corners`, `default_view.center`.
- MapLibre GL / GeoJSON layers use **`[lng, lat]`**. Convert only at the boundary:
  - `toLngLat([lat, lng])` in `MapImage.tsx`
  - `toLatLngListFromRing(ring)` / the `[lat, lng] -> [lng, lat]` map in `MapDraw.tsx` `areasToFeatureCollection`
- `MapImage` corner order differs too: the API gives `[TL, TR, BL, BR]` but a MapLibre image source wants `[TL, TR, BR, BL]` — `toImageSourceCoordinates` does the swap. Do not "fix" the order elsewhere.

## Stacking: markers, popups, overlays

All constants live in `mapZIndex.ts`; the formula lives in `mapPriority.ts`. Never hand-roll a z-index.

- `MAP_Z_INDEX`: MARKER 1000, POPUP 1300, NOTIFICATION 1400, DIALOG 3100, UI_OVERLAY 450000. `MapView` also sets these on `.maplibregl-*` classes via MUI `sx`.
- Marker priority = `MARKER + domainTier * DOMAIN_STEP(50000) + statusTier * STATUS_STEP(8000) + yRank * 7 + (hashName(name) % 7)`.
  - **Domain tier** (`getDomainTier`): `robot`=3 > `equipment`=2 > `infrastructure`=1 > other=0. Derived from the first `.`-segment of `domain`.
  - **Status tier** (`clampMapStatusTier`): only 1–5 counts; anything else = 0.
  - **Screen-Y ordering**: markers lower on screen draw on top (1000 y-buckets) so overlap reads correctly; recomputed on `move`/`rotate`/`pitch`/`zoom`/`resize` — any new marker/popup must re-subscribe to those events.
- Popup z-index = `markerPriority + getNodePopupPriorityBase() + POPUP_FROM_MARKER_OFFSET(300)`, applied by DOM query on the `node-popup-*` class, with a MutationObserver + 2 rAF retries because the popup element mounts asynchronously.

## Status codes, colors, text, icons

- `clampMapStatus` clamps to 0–9 (broader than the z-index tier's 1–5). Colors in `statusColors.ts`: 0 DISCONNECT grey[400], 1 WAITING info, 2 MANUAL secondary, 3 ACTIVE success, 4 WARNING warning, 5 ERROR error.
- `domain` strings are `group.type...`; parse with the split-on-`.` pattern in `NodeMarkers.tsx`, never by string prefix.
- Status label i18n: `Node.<group>.<type>.state.<code>`, falling back to `Map.state.<code>` when the key doesn't resolve.
- Marker icons: fetch `/api/files/icons` once, then pick the file starting with `<domain>.<clampedStatus>.`; fall back to a colored default marker (anchor `bottom`, offset `[0,6]`). Icons get `anchor: "center"`, 40px box.
- Floor-plan images load via `/api/files/map_images/<name>`.

## Areas / zones (`MapDraw`, `IntersectionDraw`)

- Model: `Area = { name, vertex_list: [lat,lng][] }`. Stored rings are **open**; GeoJSON rings are **closed** — use `ensureClosedRing`/`sanitizeRing`. Round to 6 decimals (`roundRing`).
- Drawing is `@geoman-io/maplibre-geoman-free`; only polygon draw is enabled (`MapDraw.tsx` gmOptions — don't enable other shapes without checking Area consumers).
- Identity is `properties.gm_id` (resolved via `getGmFeatureId`: `__gm_id` → `id` → `client_id`). Keep it stable across rename/reshape via `importUpdateByGmId`.
- Auto-naming: `<Config:area.prefix> N` using the smallest free integer; empty names are backfilled, and a name cache (`currentNamesRef`) survives Geoman re-imports.
- Resilience patterns to preserve: `lastGoodFcRef` rehydrates after empty reads, `suppressRehydrateOnceRef` guards deletes, `refreshWithRetry`/`syncAfterImport` poll because Geoman import is async. Adding a mutation path? Route it through `importUpdateByGmId` + `refreshWithRetry`, not direct source edits.
- Intersections keep two zone sets: `entry_area` and `reserve_area` (`IntersectionForm`).

## MapLibreImage editing rules

- `corners` prop is the source of truth; `localCorners` is draft state. While transforming (`transformingRef`), freeze the Source coords (`frozenCornersRef`), push pixels via `ImageSource.setCoordinates` directly, and only `commitCorners()` on pointer-up — never stream intermediate corners to the parent.
- Clamp lat to ±85.05112878 and wrap lng to [-180,180) (`clampLL`); corner drag is uniform-scale anchored on the opposite corner, scale clamped to |t| ∈ [0.10, 10]; rotation snaps ±1° to 0/90/180/270; undo history capped at 50.

## Map view / config

- `default_view { center: [lat,lng], zoom, rotate }` comes from `POST /domain/freedom.map` (retried every 5s on failure in `MapView`). Pitch is locked to 0 everywhere.
- Base layers `osm` | `gsi_std` | `gsi_ort`; overlay images are layer-ordered by `beforeId` chaining anchored at the invisible `overlay-anchor-layer` — keep that anchor first.

## Verify

`cd frontend && npm run lint` (repo has pre-existing lint errors — compare, don't blanket-fix) and `npm run build`.
