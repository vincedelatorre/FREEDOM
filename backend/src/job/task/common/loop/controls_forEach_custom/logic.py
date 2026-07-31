# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio
import logging

from src.repository import repository
from src import job
from src.job import command
from src.job.task import abstract
from src.job.task.common.loop.exception import LoopBreak, LoopContinue
from src.job.task.common.loop.controls_forEach_custom import Domain


class Logic(abstract.statement.Logic[Domain]):
    """controls_forEach_customタスク ロジック"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        if not self.domain.command:
            self.domain.count = 0
        node = repository.retrieve(job.active.Node, id=self._job_id)[0]
        self._var = next(node.retrieve_variables(id=self.domain.VAR["id"]))
        self._LIST = await self.domain.LIST.make_logic(self._job_id, self._logger)
        if not self.domain.command:
            self.domain.command.append(command.Text(""))
            if self.domain.DO:
                self.domain.command.append(command.Task(self.domain.DO.id))
        self._DO = await self.domain.DO.make_logic(self._job_id, self._logger) if self.domain.DO else None

    async def exec(self):
        """タスク実行"""
        values = await self._LIST.exec()
        self._logger.info(f"{self.domain.name} list={values}")
        for self._var.value in values[self.domain.count:]:
            self._logger.info(f"{self.domain.name} count={self.domain.count} value={self._var.value}")
            text:command.Text = self.domain.command[0]
            text.label = f"{self.domain.count+1} / {len(values)}周目"
            try:
                if self.domain.DO:
                    task:command.Task = self.domain.command[1]
                    if self.domain.should_log:
                        await task.exec(self._DO, self._logger)
                    else:
                        await task.exec(self._DO, logging.getLogger("loop"))
            except LoopBreak:
                break
            except LoopContinue:
                pass
            self.domain.DO = abstract.statement.Domain.to_domain(self.domain.DO_copy) if self.domain.DO_copy else None
            self._DO = await self.domain.DO.make_logic(self._job_id, self._logger) if self.domain.DO else None
            self.domain.count += 1
            await asyncio.sleep(0)
