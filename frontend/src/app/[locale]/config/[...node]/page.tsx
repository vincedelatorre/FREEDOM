/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation';
import { Typography } from "@mui/material";
import { PageContainer } from '@toolpad/core/PageContainer';
import ConfigForm, { FormResponse, DataResponse } from '@/components/config/ConfigForm';
import axios from '@/lib/axios';


/** 汎用設定画面 */
export default function ConfigGeneralPage(): React.JSX.Element {
  const [ form, setForm ] = useState<FormResponse>()
  const [ data, setData ] = useState<DataResponse>()
  const params = useParams<{ node: string }>();
  const translate = useTranslations();

  const node = Array.isArray(params.node) ? params.node.join(".") : params.node
  const title = translate("Config.title", {node: translate(`Node.${node}.name`)});

  /** 設定フォーム取得 */
  useEffect(() => {
    const run = () => {
      axios
        .post<DataResponse>("/node/freedom.main", {
          func: "fetch_config",
          kwargs: { node: node }
        })
        .then(res => setData(res.data))
        .catch(() => {
          setTimeout(() => {
            run()
          }, 5000)
        })
    }
    run()
  }, [])

  /** 設定データ取得 */
  useEffect(() => {
    const run = () => {
      axios
        .post<FormResponse>("/node/freedom.main", {
          func: "fetch_form",
          kwargs: { node: node }
        })
        .then(res => setForm(res.data))
        .catch(() => {
          setTimeout(() => {
            run()
          }, 5000)
        })
    }
    run()
  }, [])

  return (
    <PageContainer title={title}>
      {node && data && form ? (
        <ConfigForm node={node} data={data} form={form}/>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </PageContainer>
  );
};
