# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.dict.dict_set_item import Domain


class Logic(abstract.statement.Logic[Domain]):
    """dict_set_itemタスク"""
    async def init(self):
        """ジョブ開始・復帰時処理"""
        await super().init()
        self._dict = await self.domain.DICT.make_logic(self._job_id, self._logger)
        self._key = None
        self._value = None
        if self.domain.KEY:
            self._key = await self.domain.KEY.make_logic(self._job_id, self._logger)
        if self.domain.VALUE:
            self._value = await self.domain.VALUE.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        _dict = await self._dict.exec()
        key = await self._key.exec() if self._key else None
        value = await self._value.exec() if self._value else None
        _dict[key] = value
