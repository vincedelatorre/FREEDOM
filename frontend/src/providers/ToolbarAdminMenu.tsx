/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter } from "@/i18n/navigation";
import { useSessionInfo } from "@/providers/SessionContext";
import { useTranslations } from "next-intl";


export default function ToolbarAdminMenu() {
  const router = useRouter();
  const session = useSessionInfo();

  const tToolbar = useTranslations("Toolbar.adminMenu");
  const tAccess = useTranslations("Admin.accessControl");
  const tUsers = useTranslations("Admin.users");

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const isAdmin = session?.authenticated === true && session?.role === "admin";
  if (!isAdmin) return null;

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={tToolbar("tooltip")}>
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push("/admin/access-control");
          }}
        >
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tAccess("title")}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push("/admin/users");
          }}
        >
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tUsers("title")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
