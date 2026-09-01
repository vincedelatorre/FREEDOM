/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { MultiSelectFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * 複数選択入力フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function MultiSelectForm({ name, form, disabled, validate }: FormProps<MultiSelectFormResponse>) {
  const { control } = useFormContext();
  const translate = useTranslations("Config");

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: (form.required ?? true) && translate("validate.required"),
        validate: validate,
      }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <InputLabel id={`${name}-label`} required={form.required}>
            {form.label}
          </InputLabel>
          <Select
            {...field}
            multiple
            value={Array.isArray(field.value) ? field.value.map(v => Object.entries(form.items).find(([, val]) => val === v)?.[0]) : []}
            onChange={(e) => {
              const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
              field.onChange(
                value
                  .filter((v): v is string => typeof v === "string")
                  .map(v => form.items[v]),
              );
            }}
            inputRef={ref}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            labelId={`${name}-label`}
            id={name}
            label={form.label}
            disabled={disabled}
          >
            {Object.entries(form.items).map(([label, value]) => (
              <MenuItem key={String(value)} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {!!fieldState.error && (
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}