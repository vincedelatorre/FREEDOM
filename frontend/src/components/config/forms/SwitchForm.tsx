/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Controller, useFormContext } from "react-hook-form";
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch,
} from "@mui/material";
import { SwitchFormResponse } from "@/types/config";
import { FormProps } from "@/components/config/forms";


/**
 * スイッチフォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function SwitchForm({ name, form, disabled, validate }: FormProps<SwitchFormResponse>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: validate,
      }}
      render={({ field, fieldState }) => (
        <FormGroup {...field}>
          <FormControlLabel
            control={<Switch name={name} checked={field.value} />}
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            label={form.label}
            value={field.value}
            labelPlacement="start"
            disabled={disabled}
            sx={{ whiteSpace: 'nowrap' }}
          />
          {!!fieldState.error && (
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          )}
        </FormGroup>
      )}
    />
  );
}
