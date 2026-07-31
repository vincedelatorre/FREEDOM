# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job import command
from src.job.task import abstract
from src.job.task.common.control.controls_log import Domain


class Logic(abstract.statement.Logic[Domain]):
    """ログ表示タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._message = await self.domain.message.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        message = str(await self._message.exec())
        self.domain.command.append(command.Text(message))
        if self.domain.level == "DEBUG":
            self._logger.debug(f"{self.domain.name}: {message}")
        elif self.domain.level == "INFO":
            self._logger.info(f"{self.domain.name}: {message}")
        elif self.domain.level == "WARNING":
            self._logger.warning(f"{self.domain.name}: {message}")
        elif self.domain.level == "ERROR":
            self._logger.error(f"{self.domain.name}: {message}")
