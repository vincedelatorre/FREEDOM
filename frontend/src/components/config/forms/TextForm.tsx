/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { InputAdornment, TextField } from "@mui/material";
import { TextFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * 文字入力フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function TextForm({ name, form, disabled, validate }: FormProps<TextFormResponse>) {
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
        <TextField
          {...field}
          inputRef={ref}
          fullWidth
          label={form.label}
          multiline={form.multiline}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={{
            input: {
              startAdornment: form?.prefix && (
                <InputAdornment position="start">
                  {form.prefix}
                </InputAdornment>
              ),
              endAdornment: form?.suffix && (
                <InputAdornment position="end">
                  {form.suffix}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
