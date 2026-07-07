# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.list.lists_isEmpty import Domain


class Logic(abstract.value.Logic[Domain]):
    """lists_isEmptyタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._VALUE = await self.domain.VALUE.make_logic(self._job_id, self._logger)

    async def exec(self) -> bool:
        """タスク実行"""
        VALUE = list(await self._VALUE.exec())
        return not len(VALUE)
