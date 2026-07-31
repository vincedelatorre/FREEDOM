# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio

from src.job import command
from src.job.task import abstract
from src.job.task.common.control.controls_wait_manual import Domain


class Logic(abstract.statement.Logic[Domain]):
    """手動待機タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._label = await self.domain.label.make_logic(self._job_id, self._logger)

    async def exec(self):
        """タスク実行"""
        self.domain.command.clear()
        try:
            label = await self._label.exec()
            self.domain.command.append(command.Button(label, label))
            while self.domain.command:
                await asyncio.sleep(0)
        finally:
            self.domain.command.clear()

    async def exec_command(self, command:str):
        """コマンド実行
        Args:
            command (str): コマンド内容
        """
        if command == await self._label.exec():
            self.domain.command.clear()
        else:
            await super().exec_command(command)
