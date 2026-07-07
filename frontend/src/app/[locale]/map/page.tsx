/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "@/lib/axios";
import DisplaySettingsPanel from "@/components/map/DisplaySettingsPanel";
import NodeNotification from "@/components/map/NodeNotification";
import type { NodeStatus } from "@/types/node";
import type { NodeMarkerItem } from "@/types/map";

const NodeMarkers = dynamic(() => import("@/components/map/NodeMarkers"), { ssr: false });
const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function MapPage() {
  const [updateCycle, setUpdateCycle] = useState<number>(0);
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [nodeVisibility, setNodeVisibility] = useState<{ [nodeName: string]: boolean }>({});
  const [nodeLabelVisibility, setNodeLabelVisibility] = useState<{ [nodeName: string]: boolean }>({});
  const [settingsOpen, setSettingsOpen] = useState(false);

  const inFlightRef = useRef(false);
  const prevFingerprintRef = useRef<string>("");

  const normalizeStatuses = (list: NodeStatus[]): NodeStatus[] =>
    list
      .filter((n) => n && Number(n.state) !== -1)
      .map((n) => ({
        ...n,
        domain: n.domain ?? n.node ?? "default",
      }));

  const fingerprintStatuses = (list: NodeStatus[]): string => {
    const pick = list.map((n) => ({
      name: String(n.name),
      lat: Array.isArray(n.location) ? n.location[0] : undefined,
      lng: Array.isArray(n.location) ? n.location[1] : undefined,
      state: typeof n.state === "number" ? n.state : Number(n.state) || 0,
      domain: n.domain ?? n.node ?? "default",
    }));
    pick.sort((a, b) => a.name.localeCompare(b.name));
    return JSON.stringify(pick);
    // ※ 表示用観点・差分検知用
  };

  const safePost = async (url: string, body?: any) => {
    try {
      const res = await axios.post(url, body);
      return res.data;
    } catch (e) {
      console.error(`POST ${url} failed:`, e);
      return null;
    }
  };

  const fetchNodes = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const data = await safePost("/node/freedom.map", {
        func: "fetch_status",
        kwargs: {},
      });

      const rawList: any[] = Array.isArray(data) ? data : (data?.nodes ?? []);
      const asStatus: NodeStatus[] = rawList.map((s) => {
        const okLoc =
          Array.isArray(s?.location) &&
          s.location.length >= 2 &&
          Number.isFinite(s.location[0]) &&
          Number.isFinite(s.location[1]);
        return {
          name: String(s?.name ?? ""),
          state: Number.isFinite(s?.state) ? Number(s.state) : 0,
          location: okLoc ? [Number(s.location[0]), Number(s.location[1])] : null,
          node: typeof s?.node === "string" ? s.node : undefined,
          domain: typeof s?.domain === "string" ? s.domain : undefined,
          info: Array.isArray(s?.info) ? s.info.map(String) : undefined,
          detail: s?.detail,
        } as NodeStatus;
      });

      const all = normalizeStatuses(asStatus);
      const fp = fingerprintStatuses(all);
      if (fp !== prevFingerprintRef.current) {
        prevFingerprintRef.current = fp;
        setNodes(all);

        setNodeVisibility((prev) => {
          const next = { ...prev };
          const names = new Set(all.map((n) => n.name));
          for (const n of all) if (!(n.name in next)) next[n.name] = true;
          for (const key of Object.keys(next)) if (!names.has(key)) delete next[key];
          return next;
        });

        setNodeLabelVisibility((prev) => {
          const next = { ...prev };
          const names = new Set(all.map((n) => n.name));
          for (const n of all) if (!(n.name in next)) next[n.name] = true;
          for (const key of Object.keys(next)) if (!names.has(key)) delete next[key];
          return next;
        });
      }
    } catch (e) {
      console.error("fetchNodes failed:", e);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchNodes();
    if (updateCycle > 0) {
      const id = setInterval(fetchNodes, updateCycle * 1000);
      return () => clearInterval(id);
    }
  }, [updateCycle, fetchNodes]);

  useEffect(() => {
    (async () => {
      const config = await safePost("/domain/freedom.user_interface");
      const domainConfig = Array.isArray(config) ? config[0] : config;
      const cycle = domainConfig?.update_cycle;
      if (typeof cycle === "number" && cycle > 0)
        setUpdateCycle(cycle);
    })();
  }, []);

  const markerNodes = useMemo<NodeMarkerItem[]>(() => {
    return nodes
      .filter(
        (n) =>
          Array.isArray(n.location) &&
          n.location.length >= 2 &&
          Number.isFinite(n.location[0]) &&
          Number.isFinite(n.location[1]),
      )
      .map((n) => {
        const lat = n.location![0];
        const lng = n.location![1];
        const domain = n.domain ?? n.node ?? "default";
        return {
          id: `${encodeURIComponent(domain)}:${encodeURIComponent(n.name)}`,
          name: n.name,
          location: [lat, lng],
          state: typeof n.state === "number" ? n.state : Number(n.state) || 0,
          domain,
          info: n.info,
        } satisfies NodeMarkerItem;
      });
  }, [nodes]);

  const formatInfo = React.useCallback((info?: string[]) => (info && info.length ? info.join(" / ") : ""), []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <NodeNotification
        nodes={nodes}
        formatInfo={formatInfo}
      />
      <DisplaySettingsPanel
        nodes={nodes}
        nodeVisibility={nodeVisibility}
        setNodeVisibility={setNodeVisibility}
        nodeLabelVisibility={nodeLabelVisibility}
        setNodeLabelVisibility={setNodeLabelVisibility}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
      <MapView style={{ width: "100%", height: "100%" }}>
        <NodeMarkers
          nodes={markerNodes}
          nodeVisibility={nodeVisibility}
          nodeLabelVisibility={nodeLabelVisibility}
        />
      </MapView>
    </div>
  );
}