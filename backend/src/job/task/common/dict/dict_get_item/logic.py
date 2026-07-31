# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.dict.dict_get_item import Domain


class Logic(abstract.value.Logic[Domain]):
    """dict_get_itemタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._DICT = await self.domain.DICT.make_logic(self._job_id, self._logger)
        self._KEY = await self.domain.KEY.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        _dict:dict = await self._DICT.exec()
        key = await self._KEY.exec()
        return _dict.get(key)
