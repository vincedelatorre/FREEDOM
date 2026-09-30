/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useDialogs } from "@toolpad/core/useDialogs";


export type PlcBitAddressRow = {
  id: string;
  type: "bit";
  name: string;
  bit: number;
  data: boolean | null;
  default?: boolean | null;
};

export type PlcWordAddressRow = {
  id: string;
  type: "word";
  name: string;
  data: number | null;
};

export type PlcAddressRow = PlcBitAddressRow | PlcWordAddressRow;

type Props = {
  nodeName: string;
  rows: PlcAddressRow[];
  sending: Record<string, boolean>;
  onWrite: (row: PlcAddressRow, data: boolean | number) => Promise<void> | void;
};

function formatCurrentValue(row: PlcAddressRow): string {
  if (row.data === null || row.data === undefined) {
    return "-";
  }

  if (row.type === "bit") {
    return row.data ? "ON" : "OFF";
  }

  return String(row.data);
}

export default function PlcAddressTable({
  nodeName,
  rows,
  sending,
  onWrite,
}: Props) {
  const translate = useTranslations("Node.equipment.plc");
  const dialogs = useDialogs();

  const [wordInputs, setWordInputs] = useState<Record<string, string>>({});
  const [wordErrors, setWordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setWordInputs((prev) => {
      const next = { ...prev };

      for (const row of rows) {
        if (row.type !== "word") continue;

        if (next[row.id] === undefined) {
          next[row.id] = "";
        }
      }

      const rowIds = new Set(rows.map((row) => row.id));
      for (const key of Object.keys(next)) {
        if (!rowIds.has(key)) {
          delete next[key];
        }
      }

      return next;
    });

    setWordErrors((prev) => {
      const next = { ...prev };

      const rowIds = new Set(rows.map((row) => row.id));
      for (const key of Object.keys(next)) {
        if (!rowIds.has(key)) {
          delete next[key];
        }
      }

      return next;
    });
  }, [rows]);

  const handleWriteBit = useCallback(
    (row: PlcBitAddressRow, nextValue: boolean) => async (e: React.MouseEvent<Element>) => {
      e.stopPropagation();

      const result = await dialogs.confirm(
        translate("dialog.write", {
          node: nodeName,
          name: row.name,
          value: nextValue ? "ON" : "OFF",
        }),
        {
          title: translate("dialog.title"),
          okText: translate("dialog.ok"),
          cancelText: translate("dialog.cancel"),
        },
      );

      if (!result) return;

      await onWrite(row, nextValue);
    },
    [dialogs, nodeName, onWrite, translate],
  );

  const getWordInputError = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      return "";
    }

    if (!/^\d+$/.test(trimmedValue)) {
      return translate("table.errorMessage");
    }

    return "";
  };

  const toWordNumber = (rawValue: string): number => {
    return Number(rawValue.trim());
  };

  const handleChangeWordInput = useCallback(
    (rowId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const error = getWordInputError(value);

      setWordInputs((prev) => ({
        ...prev,
        [rowId]: value,
      }));

      setWordErrors((prev) => ({
        ...prev,
        [rowId]: error,
      }));
    },
    [],
  );

  const handleWriteWord = useCallback(
    (row: PlcWordAddressRow) => async (e: React.MouseEvent<Element>) => {
      e.stopPropagation();

      const rawValue = wordInputs[row.id] ?? "";
      const trimmedValue = rawValue.trim();

      if (trimmedValue === "") {
        return;
      }

      const error = getWordInputError(rawValue);

      if (error) {
        setWordErrors((prev) => ({
          ...prev,
          [row.id]: error,
        }));
        return;
      }

      const value = toWordNumber(rawValue);

      const result = await dialogs.confirm(
        translate("dialog.write", {
          node: nodeName,
          name: row.name,
          value: value,
        }),
        {
          title: translate("dialog.title"),
          okText: translate("dialog.ok"),
          cancelText: translate("dialog.cancel"),
        },
      );

      if (!result) return;

      await onWrite(row, value);

      setWordInputs((prev) => ({
        ...prev,
        [row.id]: "",
      }));

      setWordErrors((prev) => ({
        ...prev,
        [row.id]: "",
      }));
    },
    [dialogs, nodeName, onWrite, translate, wordInputs],
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        {translate("table.title")}
      </Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ width: 700, tableLayout: "fixed" }} aria-label={`${nodeName} address table`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50%", fontWeight: "bold" }}>
                {translate("table.name")}
              </TableCell>
              <TableCell sx={{ width: "16%", fontWeight: "bold" }}>
                {translate("table.type")}
              </TableCell>
              <TableCell sx={{ width: "16%", fontWeight: "bold" }}>
                {translate("table.status")}
              </TableCell>
              <TableCell sx={{ width: "28%", fontWeight: "bold" }}>
                {translate("table.action")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ color: "text.secondary" }}>
                  {translate("table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const sendingKey = `${nodeName}:${row.id}`;
                const isSending = !!sending[sendingKey];
                const inputValue = wordInputs[row.id] ?? "";
                const trimmedInputValue = inputValue.trim();
                const errorMessage = wordErrors[row.id] || getWordInputError(inputValue);
                const hasError = !!errorMessage;
                const isEmpty = trimmedInputValue === "";

                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={row.type === "bit" ? "Bit" : "Word"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: row.type === "bit" ? 700 : 400,
                        }}
                      >
                        {formatCurrentValue(row)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {row.type === "bit" && row.default === null ? (
                        <Typography>
                          {translate("table.readOnly")}
                        </Typography>
                      ) : row.type === "bit" ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleWriteBit(row, true)}
                            disabled={isSending}
                          >
                            {translate("button.on")}
                          </Button>

                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleWriteBit(row, false)}
                            disabled={isSending}
                          >
                            {translate("button.off")}
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                          <TextField
                            size="small"
                            type="text"
                            value={wordInputs[row.id] ?? ""}
                            onChange={handleChangeWordInput(row.id)}
                            error={hasError}
                            helperText={errorMessage || undefined}
                            disabled={isSending}
                            sx={{ width: 65 }}
                            slotProps={{
                              htmlInput: {
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              },
                            }}
                          />

                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleWriteWord(row)}
                            disabled={isSending || isEmpty || hasError}
                            sx={{ mt: 0.25, whiteSpace: "nowrap", height: 40 }}
                          >
                            {translate("button.write")}
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}