/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MuiColorInput, matchIsValidColor } from "mui-color-input";
import { ColorFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * 色入力フォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function ColorForm({ name, form, disabled, validate }: FormProps<ColorFormResponse>) {
  const { control } = useFormContext();
  const translate = useTranslations("Config");

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: (form.required ?? true) && translate("validate.required"),
        validate:  {...validate, ...matchIsValidColor}
      }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <MuiColorInput
          {...field}
          inputRef={ref}
          fullWidth
          label={form.label}
          disabled={disabled}
          format="hex"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
