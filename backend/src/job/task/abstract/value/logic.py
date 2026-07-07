# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc
import logging
import typing

if typing.TYPE_CHECKING:
    from src.job.task.abstract.value import Domain


class Logic[D:Domain](abc.ABC):
    def __init__(self, domain:D, job_id:int, logger:logging.Logger):
        """抽象値タスク処理
        Args:
            domain (D): 設定
            job_id (int): ジョブID
            logger (logging.Logger): ロガー
        """
        self.domain = domain
        self._job_id = job_id
        self._logger = logger

    async def init(self):
        """ジョブ開始・復帰時処理"""
        pass

    @abc.abstractmethod
    async def exec(self):
        """タスク実行"""
        raise NotImplementedError("Subclasses must implement exec method")
