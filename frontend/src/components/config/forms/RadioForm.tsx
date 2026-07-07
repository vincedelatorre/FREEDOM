/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { RadioFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";

/**
 * ラジオボタンフォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function RadioForm({ name, form, disabled, validate }: FormProps<RadioFormResponse>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: validate,
      }}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} disabled={disabled}>
          <FormLabel>{form.label}</FormLabel>
          <RadioGroup
            {...field}
            row={!!form.row}
            value={Object.entries(form.items).find(([, v]) => v === field.value)?.[0]}
            onChange={(_e, value) => field.onChange(form.items[value])}
          >
            {Object.entries(form.items).map(([label, value]) => (
              <FormControlLabel
                key={`${name}-${String(value)}`}
                value={label}
                control={<Radio />}
                label={label}
              />
            ))}
          </RadioGroup>
          {!!fieldState.error && (
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}