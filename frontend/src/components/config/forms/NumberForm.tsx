/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { TextField, InputAdornment } from "@mui/material";
import { NumberFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * 数値入力フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function NumberForm({ name, form, disabled, validate }: FormProps<NumberFormResponse>) {
  const { control } = useFormContext();
  const [ input, setInput ] = useState<string>()
  const translate = useTranslations("Config");

  /** 数値判定 */
  const isNumber = (value: number) => {
    if (form.integer) {
      return Number.isInteger(value) || translate("validate.number.onlyInteger")
    } else {
      return isFinite(value) || translate("validate.number.onlyNumber")
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: (form.required ?? true) && translate("validate.required"),
        max: form.max !== undefined
          ? { value: form.max, message: translate("validate.number.maxRange", {max: form.max}) }
          : undefined,
        min: form.min !== undefined
          ? { value: form.min, message: translate("validate.number.minRange", {min: form.min}) }
          : undefined,
        validate: {...validate, ...{isNumber: isNumber}}
      }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          inputRef={ref}
          fullWidth
          type="text"
          inputMode={form.integer ? 'numeric' : 'decimal'}
          label={form.label}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          value={input ?? field.value}
          onChange={(e) => {
            setInput(e.target.value)
            field.onChange(e.target.value && Number(e.target.value))
          }}
          slotProps={{
            input: {
              startAdornment: form.prefix && (
                <InputAdornment position="start">
                  {form.prefix}
                </InputAdornment>
              ),
              endAdornment: form.suffix && (
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
