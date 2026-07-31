# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio
from datetime import timedelta

from src.job.task import abstract
from src.job.task.common.control.controls_wait_logic import Domain


class Logic(abstract.statement.Logic[Domain]):
    """条件待機タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._cond = await self.domain.cond.make_logic(self._job_id, self._logger)
        self._interval = await self.domain.interval.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        interval:timedelta = await self._interval.exec()
        while True:
            cond = await self._cond.exec()
            if self.domain.mode == "while" and not cond:
                break
            elif self.domain.mode == "until" and cond:
                break
            await asyncio.sleep(interval.total_seconds())
