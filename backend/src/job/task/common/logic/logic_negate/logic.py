# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.logic.logic_negate import Domain


class Logic(abstract.value.Logic[Domain]):
    """logic_negateタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._BOOL = await self.domain.BOOL.make_logic(self._job_id, self._logger) if self.domain.BOOL else None

    async def exec(self) -> bool:
        """タスク実行"""
        BOOL = bool(await self._BOOL.exec()) if self._BOOL else None
        return not BOOL
