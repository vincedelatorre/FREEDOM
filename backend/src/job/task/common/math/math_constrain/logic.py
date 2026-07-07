# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.math.math_constrain import Domain


class Logic(abstract.value.Logic[Domain]):
    """math_roundタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._VALUE = await self.domain.VALUE.make_logic(self._job_id, self._logger)
        self._LOW = await self.domain.LOW.make_logic(self._job_id, self._logger)
        self._HIGH = await self.domain.HIGH.make_logic(self._job_id, self._logger)

    async def exec(self) -> float | int:
        """タスク実行"""
        value = await self._VALUE.exec()
        low = await self._LOW.exec()
        high = await self._HIGH.exec()
        return min(max(value, low), high)
