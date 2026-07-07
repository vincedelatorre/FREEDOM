/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { DataFormResponse, SwitchFormResponse } from "@/types/config";
import { FormProps, FormMap } from "@/components/config/forms";
import SwitchForm from "@/components/config/forms/SwitchForm";


/**
 * データフォーム
 * @param name 設定名
 * @param form 設定内容
 * @param disabled 無効
 * @param validate 検証イベント
 */
export default function DataForm(
  { name, form, disabled, validate }: FormProps<DataFormResponse>
) {
  const { control } = useFormContext();
  const items = useWatch({ control, name: name });
  const [ open, setOpen ] = useState<boolean>(true);
  const caption = useMemo(() => (
    Object.keys(form.forms)
      .filter(key => key !== "enable")
      .map(key => `${form.forms[key].label}: ${items[key]}`)
      .join(", ")
  ), [items, form.forms])

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={2}
      onChange={(_, expanded) => setOpen(expanded)}
      sx={
        disabled || !(items?.enable ?? true)
          ? { bgcolor: 'action.disabledBackground' }
          : undefined
      }
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            minWidth: 0,
            gap: {md: 3, xs: 1},
            alignItems: 'center',
            justifyContent: "flex-start",
            '& > :last-child': {
              ml: "auto"
            },
          },
          gap: 2
        }}
      >
        { form?.label &&
          <Typography component="span" noWrap sx={{
            flexShrink: 0,
            textOverflow: 'ellipsis',
          }}>
            {form.label}
          </Typography>
        }
        { !open &&
          <Typography component="span" noWrap variant="caption" sx={{
            color: 'text.secondary',
            flexShrink: 2,
            textOverflow: 'ellipsis',
          }}>
            {caption}
          </Typography>
        }
        { items?.enable !== undefined &&
          <SwitchForm
            name={`${name}.enable`}
            form={form.forms.enable as SwitchFormResponse}
            disabled={disabled}
            validate={validate}
          />
        }
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1} sx={{ mx: {md: 2} }}>
          {Object.keys(form.forms)
            .filter(key => key !== "enable")
            .map((key, i) => {
              const FormComponent = FormMap[form.forms[key].type] as React.ComponentType<FormProps>;
              return (
                <FormComponent
                  key={`${name}.${i}`}
                  name={`${name}.${key}`}
                  form={form.forms[key]}
                  disabled={disabled}
                  validate={validate}
                />
              );
            }
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
