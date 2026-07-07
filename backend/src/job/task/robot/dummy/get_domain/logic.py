# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src import robot
from src.job.task import abstract
from src.job.task.robot.dummy.get_domain import Domain


class Logic(abstract.value.Logic[Domain]):
    """ドメイン取得タスク"""
    async def init(self):
        """ジョブ開始・復帰時処理"""
        await super().init()
        self._robot = await self.domain.robot.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        node:robot.dummy.Node = await self._robot.exec()
        return getattr(node.domain, self.domain.config, None)
