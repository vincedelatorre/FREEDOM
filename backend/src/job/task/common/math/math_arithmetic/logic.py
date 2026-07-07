# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.math.math_arithmetic import Domain


class Logic(abstract.value.Logic[Domain]):
    """math_arithmeticタスク処理"""
    async def init(self):
        """ジョブ開始時処理"""
        await super().init()
        self._A = await self.domain.A.make_logic(self._job_id, self._logger)
        self._B = await self.domain.B.make_logic(self._job_id, self._logger)

    async def exec(self) -> float | int:
        """タスク実行"""
        A = await self._A.exec()
        B = await self._B.exec()
        if self.domain.OP == "ADD":
            return A + B
        elif self.domain.OP == "MINUS":
            return A - B
        elif self.domain.OP == "MULTIPLY":
            return A * B
        elif self.domain.OP == "DIVIDE":
            return A / B
        elif self.domain.OP == "POWER":
            return A**B
        else:
            raise ValueError(f"Unknown self.domain.OP: {self.domain.OP}")
