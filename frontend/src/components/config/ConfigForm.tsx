/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button, Divider, Stack } from "@mui/material";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useDialogs } from '@toolpad/core/useDialogs';
import { useNotifications } from '@toolpad/core/useNotifications';
import axios from "@/lib/axios";
import { FormResponseType } from "@/types/config";
import { FormMap } from "@/components/config/forms";
import { useUnsavedChangesGuard } from "@/providers/UnsavedChangesProvider";


/** 設定フォーム受信内容 */
export interface FormResponse {
  /** 設定名: フォーム内容 */
  [key: string]: FormResponseType;
}

/** 設定データ受信内容 */
export interface DataResponse {
  /** 設定名: データ */
  [key: string]: any;
}

/** 設定フォームコンポーネント引数 */
export interface ConfigFormProps {
  /** ノード名 */
  node: string;
  /** 設定フォーム受信内容 */
  form: FormResponse;
  /** 設定データ受信内容 */
  data: DataResponse;
  /** dirty状態変更通知 */
  onDirtyChange?: (dirty: boolean) => void;
}

/** 設定フォームコンポーネント */
export default function ConfigForm(props: ConfigFormProps) {
  const form = useForm<DataResponse>({
    defaultValues: props.data,
    mode: "onChange",
  });
  useUnsavedChangesGuard(form.formState.isDirty);
  React.useEffect(() => {
    props.onDirtyChange?.(form.formState.isDirty);
  }, [props.onDirtyChange, form.formState.isDirty]);
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const translate = useTranslations("");

  /** フォームが正常時の更新イベント */
  const onSubmit = async(data: DataResponse) => {
    const nodeName = translate(`Node.${props.node}.name`)
    const result = await dialogs.confirm(translate("Config.dialog.content", {node: nodeName}), {
      title: translate("Config.dialog.title"),
      okText: translate("Config.dialog.ok"),
      cancelText: translate("Config.dialog.cancel"),
    })
    if (!result) return;
    try {
      await axios.post("/node/freedom.main", {
        func: "update_node",
        kwargs: { node: props.node, config: data }
      })
      form.reset(data)
      props.onDirtyChange?.(false)
      notifications.show(translate("Config.dialog.success", {node: nodeName}), {
        severity: 'success',
        autoHideDuration: 3000,
      })
    } catch (e) {
      console.error(e);
      notifications.show(translate("Config.dialog.error", {node: nodeName}), {
        severity: 'error',
        autoHideDuration: 3000,
      })
    }
  };

  /** フォームが異常時の更新イベント */
  const onError = (errors: any) => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) form.setFocus(firstKey);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <Stack
          spacing={2}
          useFlexGap
          sx={{
            pt: { xs: 0, sm: 4 },
            px: { sm: 2, md: 10 },
          }}
        >
          {Object.keys(props.form).map((key, index) => {
            const FormComponent = FormMap[props.form[key].type];
            return (
              <FormComponent key={index} name={key} form={props.form[key]} />
            );
          })}
          <Divider variant="middle" flexItem />
          <Stack sx={{alignItems: "flex-end"}}>
            <Button
              type="submit"
              variant="contained"
              disabled={!form.formState.isDirty}
              sx={{
                width: { xs: '100%', sm: 'fit-content' },
              }}
              startIcon={<UpgradeIcon />}
            >
              {translate("Config.update")}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}
