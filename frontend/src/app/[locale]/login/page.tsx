/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { broadcastAuthChanged } from "@/lib/auth-events";
import { useTranslations } from "next-intl";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login.page");
  const notifications = useNotifications();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      notifications.show(t("notify.usernameRequired"), {
        severity: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    if (!password) {
      notifications.show(t("notify.passwordRequired"), {
        severity: "warning",
        autoHideDuration: 3000,
      });
      return;
    }

    setBusy(true);
    const { error } = await authClient.signIn.username({ username, password });
    setBusy(false);

    if (error) {
      notifications.show(error.message ?? t("notify.loginFailed"), {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    notifications.show(t("notify.loginSuccess"), {
      severity: "success",
      autoHideDuration: 3000,
    });

    broadcastAuthChanged();
    router.replace("/map");
    router.refresh();
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.08)",
          p: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              {t("title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t("subtitle")}
            </Typography>
          </Box>

          <Divider />

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label={t("fields.username.label")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                fullWidth
                size="small"
                placeholder={t("fields.username.placeholder")}
              />
              <TextField
                label={t("fields.password.label")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                fullWidth
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={busy}
                fullWidth
                sx={{
                  py: 1.1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {busy ? t("buttons.processing") : t("buttons.signIn")}
              </Button>
            </Stack>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {t("note")}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
