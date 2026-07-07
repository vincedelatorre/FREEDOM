/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { Task } from "@mui/icons-material";
import { PageContainer } from '@toolpad/core/PageContainer';
import { useDialogs } from '@toolpad/core/useDialogs';
import { useNotifications } from '@toolpad/core/useNotifications';
import ActiveJobCard from '@/components/job/active/ActiveJobCard';
import { JobActiveResponse } from '@/types/job';
import axios from '@/lib/axios';
import { toDate } from '@/lib/datetime';


/** 日時をミリ秒に変換 */
function toMillis(iso: string | undefined): number {
  if (!iso) return -Infinity;
  const d = toDate(iso);
  if (!d) return -Infinity;
  const t = d.getTime();
  return Number.isFinite(t) ? t : -Infinity;
}

/** ジョブ実行ページ */
export default function JobActivePage() {
  const [jobNameList, setJobNameList] = useState<string[]>();
  const [jobName, setJobName] = useState<string>();
  const [jobList, setJobList] = useState<JobActiveResponse[]>([]);
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const translate = useTranslations("Node.job.active");

  /** 実行ジョブ内容更新 */
  const fetchJob = async () => {
    try {
      const response = await axios.post<JobActiveResponse[]>('/domain/job.active');
      const list = Array.isArray(response.data) ? response.data.slice() : [];
      list.sort((a, b) => {
        const diff = toMillis(b.created_at) - toMillis(a.created_at);
        return diff !== 0 ? diff : String(b.id).localeCompare(String(a.id));
      });
      setJobList(list);
    } catch (error) {
      console.error('GET request failed:', error);
    }
  };

  /** 5秒ごとに更新 */
  useEffect(() => {
    fetchJob();
    const intervalId = setInterval(fetchJob, 5000);
    return () => clearInterval(intervalId);
  }, []);

  /** 初期処理 */
  useEffect(() => {
      let cancelled = false;
      const run = () => {
        fetch("/api/job-names", { cache: "no-store" })
          .then(async (r) => {
            if (!r.ok) throw new Error(await r.text());
            return r.json();
          })
          .then((d) => {
            if (cancelled) return;
            const items = Array.isArray(d?.items) ? d.items : [];
            setJobNameList(items);
            if (items.length === 0) {
              setJobName(undefined);
            } else if (jobName && !items.includes(jobName)) {
              setJobName(undefined);
            }
          })
          .catch(() => {
            if (cancelled) return;
            setTimeout(run, 5000);
          });
      };
      run();
      return () => {
        cancelled = true;
      };
    }, []);

  /** ジョブ実行 */
  const handleExec = async () => {
    if (!jobName) return;
    const result = await dialogs.confirm(translate("exec.content", {job: jobName}), {
      title: translate("dialog.title"),
      okText: translate("exec.ok"),
      cancelText: translate("dialog.cancel"),
    })
    if (!result) return;
    try {
      await axios.post("/node/job.create", {
        func: "active",
        kwargs: { name: jobName }
      })
      await fetchJob()
      notifications.show(translate("exec.success", {job: jobName}), {
        severity: 'success',
        autoHideDuration: 3000,
      })
    } catch (e) {
      notifications.show(translate("exec.error", {job: jobName}), {
        severity: 'error',
        autoHideDuration: 3000,
      })
    }
  };

  return (
    <PageContainer title={translate("name")}>
      {(jobNameList === undefined) ? (
        <Typography>Loading...</Typography>
       ) : (
        <Stack spacing={2}>
          <Stack direction={{xs: "column", sm: "row"}} spacing={1}>
            <FormControl fullWidth>
              <InputLabel id="job_select_label">{translate("jobName")}</InputLabel>
              <Select
                labelId="job_select_label"
                id="job_select"
                label={translate("jobName")}
                value={jobName ?? ""}
                onChange={(event: SelectChangeEvent) => {
                  const selected = jobNameList.find(name => name === event.target.value);
                  if (selected) setJobName(selected);
                }}
              >
                {jobNameList.map((name) => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleExec}
              disabled={!jobName}
              startIcon={<Task />}
              sx={{minWidth: {xs: '100%', sm: 'fit-content'}}}
            >
              {translate("name")}
            </Button>
          </Stack>
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {jobList.map((job) => (
              <ActiveJobCard
                key={job.id}
                job={job}
                onRefresh={fetchJob}
              />
            ))}
          </Masonry>
        </Stack>
      )}
    </PageContainer>
  );
}
