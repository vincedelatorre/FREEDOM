# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from datetime import datetime

from src.job.task import abstract
from src.job.task.common.time._time_now import Domain


class Logic(abstract.value.Logic[Domain]):
    """現在時刻取得タスク処理"""
    async def exec(self) -> datetime:
        """タスク実行"""
        return datetime.now()
