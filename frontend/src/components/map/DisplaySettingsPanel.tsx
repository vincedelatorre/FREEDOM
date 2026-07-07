/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommentIcon from "@mui/icons-material/Comment";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";

export interface DisplaySettingsPanelProps {
  nodes: any[];
  nodeVisibility: { [nodeName: string]: boolean };
  setNodeVisibility: React.Dispatch<React.SetStateAction<{ [nodeName: string]: boolean }>>;
  nodeLabelVisibility: { [nodeName: string]: boolean };
  setNodeLabelVisibility: React.Dispatch<React.SetStateAction<{ [nodeName: string]: boolean }>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showHeaderLabelCollapsed?: boolean;
}

type Grouped = Array<{ category: string; subs: Array<{ sub: string; nodes: any[] }> }>;

export default function DisplaySettingsPanel({
  nodes,
  nodeVisibility,
  setNodeVisibility,
  nodeLabelVisibility,
  setNodeLabelVisibility,
  settingsOpen,
  setSettingsOpen,
  showHeaderLabelCollapsed = true,
}: DisplaySettingsPanelProps) {
  const t = useTranslations();

  /**
   * 寸法・整列設定
   */
  const CAT_HEADER_HEIGHT = 36;
  const RIGHT_GUTTER = 8;
  const SECONDARY_ICON_COL = 56;
  const LIST_ITEM_PR = RIGHT_GUTTER + SECONDARY_ICON_COL;
  const INDENT_CATEGORY = "0";
  const INDENT_SUBCATEGORY = "1ch";
  const INDENT_NODE = "2ch";

  // グルーピング
  const grouped: Grouped = React.useMemo(() => {
    const result: Grouped = [];
    const catIndex = new Map<string, number>();
    const subIndexPerCat = new Map<string, Map<string, number>>();

    nodes.forEach((node) => {
      const parts = node?.domain ? String(node.domain).split(".") : ["others"];
      const category = parts[0] || "others";
      const sub = parts[1] || parts[0] || "others";

      if (!catIndex.has(category)) {
        catIndex.set(category, result.length);
        result.push({ category, subs: [] });
        subIndexPerCat.set(category, new Map());
      }
      const catPos = catIndex.get(category)!;

      const subIndexMap = subIndexPerCat.get(category)!;
      if (!subIndexMap.has(sub)) {
        subIndexMap.set(sub, result[catPos].subs.length);
        result[catPos].subs.push({ sub, nodes: [] });
      }
      const subPos = subIndexMap.get(sub)!;

      result[catPos].subs[subPos].nodes.push(node);
    });

    return result;
  }, [nodes]);

  const applyGroupMarkerVisibility = React.useCallback((nodeList: any[], newVal: boolean) => {
    const nextVisibility = { ...nodeVisibility };
    const nextLabelVisibility = { ...nodeLabelVisibility };
    for (const node of nodeList) {
      nextVisibility[node.name] = newVal;
      if (!newVal) nextLabelVisibility[node.name] = false;
    }
    setNodeVisibility(nextVisibility);
    setNodeLabelVisibility(nextLabelVisibility);
  }, [nodeVisibility, nodeLabelVisibility, setNodeVisibility, setNodeLabelVisibility]);

  const applyGroupLabelVisibility = React.useCallback((nodeList: any[], newLabelVal: boolean) => {
    const nextLabelVisibility = { ...nodeLabelVisibility };
    const nextMarkerVisibility = { ...nodeVisibility };
    for (const node of nodeList) {
      if (newLabelVal) {
        nextLabelVisibility[node.name] = true;
        const markerOff = !nodeVisibility[node.name];
        const labelOff = nodeLabelVisibility[node.name] === false;
        if (markerOff && labelOff) nextMarkerVisibility[node.name] = true;
      } else {
        nextLabelVisibility[node.name] = false;
      }
    }
    setNodeLabelVisibility(nextLabelVisibility);
    if (newLabelVal) setNodeVisibility(nextMarkerVisibility);
  }, [nodeVisibility, nodeLabelVisibility, setNodeVisibility, setNodeLabelVisibility]);

  const isGroupAllHidden = (nodeList: any[]) => nodeList.every((n) => !nodeVisibility[n.name]);
  const willToggleGroupHidden = (nodeList: any[]) =>
    nodeList.some((n) => nodeVisibility[n.name]) ? false : true;

  const isGroupAllLabelHidden = (nodeList: any[]) =>
    nodeList.every((n) => nodeLabelVisibility[n.name] === false);
  const willToggleGroupLabelHidden = (nodeList: any[]) =>
    nodeList.some((n) => nodeLabelVisibility[n.name] !== false) ? false : true;

  const toggleCategoryVisibility = React.useCallback((category: string) => {
    const group = grouped.find((g) => g.category === category);
    if (!group) return;
    const nodeList = group.subs.flatMap((s) => s.nodes);
    applyGroupMarkerVisibility(nodeList, willToggleGroupHidden(nodeList));
  }, [grouped, applyGroupMarkerVisibility]);

  const toggleSubCategoryVisibility = React.useCallback((category: string, sub: string) => {
    const group = grouped.find((g) => g.category === category);
    const subEntry = group?.subs.find((s) => s.sub === sub);
    if (!subEntry) return;
    const nodeList = subEntry.nodes;
    applyGroupMarkerVisibility(nodeList, willToggleGroupHidden(nodeList));
  }, [grouped, applyGroupMarkerVisibility]);

  const toggleCategoryLabelVisibility = React.useCallback((category: string) => {
    const group = grouped.find((g) => g.category === category);
    if (!group) return;
    const nodeList = group.subs.flatMap((s) => s.nodes);
    applyGroupLabelVisibility(nodeList, willToggleGroupLabelHidden(nodeList));
  }, [grouped, applyGroupLabelVisibility]);

  const toggleSubCategoryLabelVisibility = React.useCallback((category: string, sub: string) => {
    const group = grouped.find((g) => g.category === category);
    const subEntry = group?.subs.find((s) => s.sub === sub);
    if (!subEntry) return;
    const nodeList = subEntry.nodes;
    applyGroupLabelVisibility(nodeList, willToggleGroupLabelHidden(nodeList));
  }, [grouped, applyGroupLabelVisibility]);

  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});
  const [expandedSubcategories, setExpandedSubcategories] =
    React.useState<Record<string, Record<string, boolean>>>({});

  const toggleCategoryExpansion = React.useCallback((category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: prev[category] === false ? true : false }));
  }, []);
  const toggleSubcategoryExpansion = React.useCallback((category: string, sub: string) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [sub]: prev[category]?.[sub] === false ? true : false },
    }));
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        p: 1,
        zIndex: 1000,
        borderRadius: 1,
        boxShadow: 1,
        width: "max-content",
        maxWidth: "80vw",
      }}
    >
      <Box
        onClick={() => setSettingsOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <MenuIcon fontSize="small" />
        {(settingsOpen || showHeaderLabelCollapsed) && (
          <Typography sx={{ ml: 0.75, lineHeight: 1 }} variant="body2" component="span">
            {t("Map.DisplaySettings")}
          </Typography>
        )}
      </Box>

      <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mt: 1,
            maxHeight: "70vh",
            overflow: "auto",
            bgcolor: "background.paper",
            "& .MuiTypography-root": { whiteSpace: "nowrap" },
            "& .MuiListItemSecondaryAction-root": { right: `${RIGHT_GUTTER}px` },
            "& .MuiListItem-root": {
              pr: `${LIST_ITEM_PR}px`,
              py: 0.25,
              minHeight: 28,
            },
          }}
        >
          <List dense disablePadding>
            {grouped.map((group) => {
              const { category, subs } = group;
              const categoryNodes = subs.flatMap((s) => s.nodes);
              const categoryExpanded = expandedCategories[category] !== false;

              return (
                <Box key={category} sx={{ pb: 1 }}>
                  {/* カテゴリ見出し */}
                  <ListSubheader
                    disableSticky={false}
                    disableGutters
                    component="div"
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      bgcolor: "background.paper",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: `${CAT_HEADER_HEIGHT}px`,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pl: INDENT_CATEGORY,
                      pr: `${RIGHT_GUTTER}px`,
                    }}
                  >
                    <Box
                      onClick={() => toggleCategoryExpansion(category)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      {categoryExpanded ? (
                        <ExpandMoreIcon fontSize="small" />
                      ) : (
                        <ChevronRightIcon fontSize="small" />
                      )}
                      <Typography variant="body2" sx={{ ml: 0.75, fontWeight: 700 }}>
                        {t(`Node.${category}.name`, { defaultValue: category })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryLabelVisibility(category);
                        }}
                      >
                        {isGroupAllLabelHidden(categoryNodes) ? (
                          <CommentsDisabledIcon fontSize="small" />
                        ) : (
                          <CommentIcon fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryVisibility(category);
                        }}
                      >
                        {isGroupAllHidden(categoryNodes) ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  </ListSubheader>

                  {/* サブカテゴリ群 */}
                  <Collapse in={categoryExpanded} timeout="auto" unmountOnExit>
                    <List dense disablePadding sx={{ pt: 0.5 }}>
                      {subs.map((subEntry) => {
                        const { sub, nodes: subNodes } = subEntry;
                        const subExpanded = expandedSubcategories[category]?.[sub] !== false;

                        return (
                          <Box key={`${category}::${sub}`} sx={{ mb: 0.5 }}>
                            <ListSubheader
                              disableSticky={false}
                              disableGutters
                              component="div"
                              sx={{
                                position: "sticky",
                                top: `${CAT_HEADER_HEIGHT}px`,
                                zIndex: 1,
                                bgcolor: "background.paper",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                minHeight: 28,
                                height: 28,
                                pl: INDENT_SUBCATEGORY,
                                pr: `${RIGHT_GUTTER}px`,
                                borderBottom: "1px dashed",
                                borderColor: "divider",
                              }}
                            >
                              <Box
                                onClick={() =>
                                  toggleSubcategoryExpansion(category, sub)
                                }
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {subExpanded ? (
                                  <ExpandMoreIcon fontSize="small" />
                                ) : (
                                  <ChevronRightIcon fontSize="small" />
                                )}
                                <Typography variant="body2" sx={{ ml: 0.75, fontWeight: 700 }}>
                                  {t(`Node.${category}.${sub}.name`, {
                                    defaultValue: sub,
                                  })}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconButton
                                  size="small"
                                  edge="end"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubCategoryLabelVisibility(category, sub);
                                  }}
                                >
                                  {isGroupAllLabelHidden(subNodes) ? (
                                    <CommentsDisabledIcon fontSize="small" />
                                  ) : (
                                    <CommentIcon fontSize="small" />
                                  )}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  edge="end"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubCategoryVisibility(category, sub);
                                  }}
                                >
                                  {isGroupAllHidden(subNodes) ? (
                                    <VisibilityOffIcon fontSize="small" />
                                  ) : (
                                    <VisibilityIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Box>
                            </ListSubheader>

                            {/* サブカテゴリ内ノード */}
                            <Collapse in={subExpanded} timeout="auto" unmountOnExit>
                              <List dense disablePadding sx={{ pl: INDENT_NODE }}>
                                {subNodes.map((node: any) => {
                                  const labelOn = nodeLabelVisibility[node.name] !== false;
                                  const visible = !!nodeVisibility[node.name];

                                  return (
                                    <ListItem
                                      key={node.name}
                                      disableGutters
                                      secondaryAction={
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <IconButton
                                            size="small"
                                            edge="end"
                                            onClick={() => {
                                              const nextLabelOn = !(nodeLabelVisibility[node.name] !== false);
                                              setNodeLabelVisibility((prev) => ({ ...prev, [node.name]: nextLabelOn }));
                                              if (nextLabelOn && !nodeVisibility[node.name]) {
                                                setNodeVisibility((prev) => ({ ...prev, [node.name]: true }));
                                              }
                                            }}
                                          >
                                            {labelOn ? <CommentIcon fontSize="small" /> : <CommentsDisabledIcon fontSize="small" />}
                                          </IconButton>

                                          <IconButton
                                            size="small"
                                            edge="end"
                                            onClick={() => {
                                              setNodeVisibility((prev) => ({
                                                ...prev,
                                                [node.name]: !prev[node.name] }));
                                              if (visible) {
                                                setNodeLabelVisibility((prev) => ({ ...prev, [node.name]: false }));
                                              }
                                            }}
                                          >
                                            {visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                                          </IconButton>
                                        </Box>
                                      }
                                      sx={{ py: 0.125 }}
                                    >
                                      <ListItemText
                                        slotProps={{
                                        primary: {
                                          variant: "body2",
                                          component: "span",
                                        },
                                      }}
                                        primary={node.name}
                                      />
                                    </ListItem>
                                  );
                                })}
                              </List>
                            </Collapse>
                          </Box>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            })}
          </List>
        </Box>
      </Collapse>
    </Box>
  );
}