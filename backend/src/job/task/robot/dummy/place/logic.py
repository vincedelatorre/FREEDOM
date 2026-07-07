# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src import robot
from src.job.task import abstract
from src.job.task.robot.dummy.place import Domain


class Logic(abstract.statement.Logic[Domain]):
    """ダミー配置タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._robot = await self.domain.robot.make_logic(self._job_id, self._logger)
        self._lat = await self.domain.latitude.make_logic(self._job_id, self._logger)
        self._lon = await self.domain.longitude.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        dummy:robot.dummy.Node = await self._robot.exec()
        lat = await self._lat.exec()
        lon = await self._lon.exec()
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError(f"Invalid coordinates: ({lat}, {lon})")
        dummy.domain.location = [lat, lon]
