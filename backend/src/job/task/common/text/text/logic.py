# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.text.text import Domain


class Logic(abstract.value.Logic[Domain]):
    """textタスク処理"""
    async def exec(self) -> str:
        """タスク実行"""
        return str(self.domain.TEXT)
