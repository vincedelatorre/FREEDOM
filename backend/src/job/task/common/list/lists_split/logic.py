# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.list.lists_split import Domain


class Logic(abstract.value.Logic[Domain]):
    """lists_splitタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._INPUT = await self.domain.INPUT.make_logic(self._job_id, self._logger)
        self._DELIM = await self.domain.DELIM.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        INPUT = str(await self._INPUT.exec())
        DELIM = str(await self._DELIM.exec())
        if self.domain.MODE == "SPLIT":
            return INPUT.split(DELIM)
        elif self.domain.MODE == "JOIN":
            return DELIM.join(INPUT)
        else:
            raise ValueError(f"Unknown mode: {self.domain.MODE}")
