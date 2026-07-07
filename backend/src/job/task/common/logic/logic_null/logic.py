# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.job.task import abstract
from src.job.task.common.logic.logic_null import Domain


class Logic(abstract.value.Logic[Domain]):
    """logic_nullタスク処理"""
    async def exec(self):
        """タスク実行"""
        return None
