# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio

from src.job.task import abstract
from src.job.task.common.control.controls_logic_wait import Domain


class Logic(abstract.statement.Logic[Domain]):
    """条件待機タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._wait_cancel = await self.domain.wait_cancel.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        while not await self._wait_cancel.exec():
            await asyncio.sleep(0)
