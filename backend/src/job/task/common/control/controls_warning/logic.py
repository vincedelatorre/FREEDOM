# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src import job
from src.repository import repository
from src.job import command
from src.job.task import abstract
from src.job.task.common.control.controls_warning import Domain


class Logic(abstract.statement.Logic[Domain]):
    """警告タスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._warning = await self.domain.warning.make_logic(self._job_id, self._logger)
        self._warning_msg = ""
        self.domain.command.clear()

    async def exec(self):
        """タスク実行"""
        self._warning_msg = await self._warning.exec()
        node = repository.retrieve(job.active.Node, id=self._job_id)[0]
        node.domain.warning_msg.add(self._warning_msg)
        self.domain.command.append(command.Button("警告リセット", "reset"))

    async def exec_command(self, command:str):
        """コマンド指示
        Args:
            command (str): コマンド内容
        """
        if command == "reset":
            node = repository.retrieve(job.active.Node, id=self._job_id)[0]
            node.domain.warning_msg.discard(self._warning_msg)
            self.domain.command.clear()
        else:
            await super().exec_command()
