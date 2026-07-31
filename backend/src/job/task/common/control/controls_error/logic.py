# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.control.controls_error import Domain


class Logic(abstract.statement.Logic[Domain]):
    """異常タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._error = await self.domain.error.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        raise RuntimeError(await self._error.exec())
