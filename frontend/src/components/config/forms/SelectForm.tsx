/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * 選択入力フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function SelectForm({ name, form, disabled, validate }: FormProps<SelectFormResponse>) {
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
            value={field.value === null ? '' : field.value}
            onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
            inputRef={ref}
            labelId={`${name}-label`}
            id={name}
            label={form.label}
            disabled={disabled}
          >
            {Object.entries(form.items).map(([label, value]) => (
              <MenuItem key={String(value)} value={value === null ? '' : value}>
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