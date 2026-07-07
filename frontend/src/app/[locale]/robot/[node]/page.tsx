/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useMemo, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from "next-intl";
import { PageContainer } from '@toolpad/core/PageContainer';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import axios from '@/lib/axios';
import StatusChip from '@/components/map/StatusChip';
import DetailCard from '@/components/node/DetailCard';
import InfoCard from '@/components/node/InfoCard';
import type { NodeStatus } from "@/types/node";
import type { NodeMarkerItem } from "@/types/map";
import ActiveJobCard, { JobActiveProvider } from '@/components/robot/JobCard';

const NodeMarkers = dynamic(() => import("@/components/map/NodeMarkers"), { ssr: false });
const MapView  = dynamic(() => import("@/components/map/MapView"),  { ssr: false });


/** ロボット詳細ページ */
export default function RobotDetailPage() {
  const params = useParams<{ node: string }>();
  const node = Array.isArray(params.node) ? params.node[0] : params.node;

  const translateRobot = useTranslations("Node.robot");
  const title = translateRobot(`${node}.name`);

  const [items, setItems] = useState<NodeStatus[]>([]);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [centerOnSelect, setCenterOnSelect] = useState<boolean>(true);

  /** 地図状態内容更新 */
  const fetchStatus = useCallback(async () => {
    if (!node) return;
    try {
      const res = await axios.post("/node/freedom.map", {
        func: "fetch_status",
        kwargs: {
          node_name: `robot.${node}`,
        },
      });
      const list: NodeStatus[] = Array.isArray(res.data) ? res.data : [];
      setItems(list);
    } catch {
      setItems([]);
    }
  }, [node]);

  /** 5秒ごとに更新 */
  useEffect(() => {
    const run = async () => {
      await fetchStatus();
    };
    run();
    const id = setInterval(run, 5000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const handleToggleOpen = useCallback((name: string) => {
    setCenterOnSelect(true);
    setOpenRows(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const handleSelectName = useCallback((name: string | null) => {
    setSelectedName(name);
    if (name) {
      setOpenRows(prev => ({ ...prev, [name]: true }));
    }
  }, []);

  useEffect(() => {
    if (selectedName && !openRows[selectedName]) {
      setSelectedName(null);
    }
  }, [openRows, selectedName]);

  const handleMarkerClick = useCallback((name: string) => {
    setCenterOnSelect(false);
    handleSelectName(name);
  }, [handleSelectName]);

  // Map 用のマーカー配列
  const nodes: NodeMarkerItem[] = useMemo(
    () => items.map((s) => ({
      id: s.name,
      name: s.name,
      location: (s.location ?? [0, 0]) as [number, number],
      state: typeof s.state === "number" ? s.state : 0,
      domain: s.domain ?? s.node ?? `robot.${node}`,
      info: s.info,
    })),
    [items, node],
  );

  const nodeVisibility = useMemo(() => {
    const vis: Record<string, boolean> = {};
    items.forEach(s => { vis[s.name] = true; });
    return vis;
  }, [items]);

  const handleToggleRow = useCallback((name: string) => {
    const willOpen = !openRows[name];
    handleToggleOpen(name);
    if (willOpen) {
      handleSelectName(name);
    }
  }, [openRows, handleToggleOpen, handleSelectName]);

  const TOP_OFFSET_PX = 120;

  return (
    <PageContainer title={title}>
      <Grid container spacing={2} sx={{ width: "100%", height: { xs: "auto", md: `calc(100vh - ${TOP_OFFSET_PX}px)` } }}>
        {/* 左：一覧（8/12） */}
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{ display: "flex", flexDirection: "column", height: { xs: "auto", md: "100%" } }}
        >
          <Paper sx={{ height: "auto", overflow: { xs: "visible", md: "auto" } }} elevation={3}>
            <JobActiveProvider refreshMs={5000}>
              <Box>
                {items.map((row) => {
                  const open = !!openRows[row.name];
                  const detailsId = `robot-${node}-${row.name}`;

                  return (
                    <Accordion
                      key={row.name}
                      expanded={open}
                      onChange={() => handleToggleRow(row.name)}
                      slotProps={{ transition: { unmountOnExit: true } }}
                      elevation={3}
                    >
                      {/* アコーディオン展開前 */}
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={detailsId}
                        id={`${detailsId}-summary`}
                        sx={{
                          minHeight: 70,
                          '&:hover': { backgroundColor: 'action.hover' },
                          '&.Mui-expanded': { minHeight: 70 },
                          '& .MuiAccordionSummary-content': {
                            width: "100%",
                            minWidth: 0,
                          },
                        }}
                      >
                        <Grid container alignItems="center" spacing={2} sx={{ width: "100%", mr: 1, minWidth: 0 }}>
                          {/* 名前 */}
                          <Grid size={5} sx={{ minWidth: 0 }}>
                            <Typography
                              component="span"
                              variant="subtitle1"
                              sx={{ fontWeight: 700, display: "block", whiteSpace: "normal", overflowWrap: "anywhere" }}
                            >
                              {row.name}
                            </Typography>
                          </Grid>

                          {/* 状態 */}
                          <Grid size={3}>
                            <StatusChip
                              label={translateRobot(`${node}.state.${String(row.state)}`)}
                              status={typeof row.state === "number" ? row.state : 0}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      {/* アコーディオン展開後 */}
                      <AccordionDetails id={detailsId}>
                        <Grid container spacing={2}>
                          {/* 情報 */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <InfoCard info={row.info} />
                          </Grid>

                          {/* 詳細 */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <DetailCard detail={row.detail} />
                          </Grid>

                          {/* 実行中ジョブ */}
                          <Grid size={12}>
                            <ActiveJobCard robotName={row.name} />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </JobActiveProvider>
          </Paper>
        </Grid>

        {/* 右：地図（4/12） */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", flexDirection: "column", height: { xs: "auto", md: "100%" } }}
        >
          <Paper sx={{ height: { md: "100%" }, display: "flex", flexDirection: "column", minHeight: 280 }} elevation={3}>
            <Box
              sx={{
                position: { xs: "relative", md: "sticky" },
                top: { md: TOP_OFFSET_PX },
                height: { xs: 360, md: `100%` },
                width: "100%",
                minHeight: 300,
              }}
            >
              <MapView style={{ width: "100%", height: "100%" }}>
                <NodeMarkers
                  nodes={nodes}
                  nodeVisibility={nodeVisibility}
                  selectedName={selectedName}
                  onMarkerClick={handleMarkerClick}
                  centerOnSelect={centerOnSelect}
                />
              </MapView>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
