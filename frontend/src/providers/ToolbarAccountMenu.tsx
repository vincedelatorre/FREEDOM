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
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { broadcastAuthChanged } from "@/lib/auth-events";
import { useSessionInfo } from "@/providers/SessionContext";
import { useTranslations } from "next-intl";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useNotifications } from "@toolpad/core/useNotifications";


export default function ToolbarAccountMenu() {
  const router = useRouter();
  const session = useSessionInfo();
  const t = useTranslations("Toolbar.accountMenu");
  const tDialog = useTranslations("Common.dialog")
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const isAuthed = session?.authenticated === true;

  const tooltipTitle = isAuthed
    ? (session?.username ?? t("tooltip.loggedInFallback"))
    : t("tooltip.loggedOut");

  const onLogout = async () => {
    const ok = await dialogs.confirm(t("confirm.logout.body"), {
      title: tDialog("title"),
      okText: t("confirm.logout.ok"),
      cancelText: tDialog("cancel"),
    });
    if (!ok) return;

    try {
      await authClient.signOut();
      notifications.show(t("notify.logout.success"), {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (e) {
      console.error(e);
      notifications.show(t("notify.logout.error"), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      broadcastAuthChanged();
      setAnchorEl(null);
      router.push("/map");
      router.refresh();
    }
  };

  const onLogin = () => {
    setAnchorEl(null);
    router.push("/login");
  };

  const menuItems = isAuthed
    ? ([
        <MenuItem key="user" disabled>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {session?.username ?? t("menu.userMissing")}
              </Typography>
            }
          />
        </MenuItem>,
        <Divider key="div" />,
        <MenuItem key="logout" onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("menu.logout")}</ListItemText>
        </MenuItem>,
      ] as React.ReactNode[])
    : ([
        <MenuItem key="guest" disabled>
          <ListItemIcon>
            <PersonOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                {t("menu.guest")}
              </Typography>
            }
          />
        </MenuItem>,
        <Divider key="div" />,
        <MenuItem key="login" onClick={onLogin}>
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("menu.login")}</ListItemText>
        </MenuItem>,
      ] as React.ReactNode[]);

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuItems}
      </Menu>
    </>
  );
}
