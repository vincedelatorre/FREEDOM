# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import inspect
import logging
import typing

from src.job import command
from src.job.task import abstract
from src.job.task.abstract.statement import Logic


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """抽象ステートメントタスクドメイン
    上下接続があるブロックはこれを継承する
    Args:
        type (str): タスク種類
        id (str): タスクID
        name (str): タスク名
            UIにタスク名として表示される内容
        next (Domain): 次タスク
        can_recover (bool): 復帰可能判定
            ジョブ停止時に復帰できる判定
        finished (bool): 終了フラグ
        command (list): コマンド内容
    """
    name:str
    next:typing.Optional['Domain'] = None
    can_recover:bool = True
    finished:bool = False
    command:list = dataclasses.field(default_factory=list)

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__()
        self.command = self._to_command(self.command)

    def _to_command(self, cmd:list[dict]) -> list:
        """コマンドクラス変換
        Args:
            cmd (list[dict]): 変換前
        Returns:
            list: 変換後
        """
        command_cls = inspect.getmembers(command, inspect.isclass)
        convert = {getattr(cls, "type"): cls for _, cls in command_cls if dataclasses.is_dataclass(cls)}
        return [convert[c.get("type")](**c) for c in cmd]

    async def make_logic(self, job_id:int, logger:logging.Logger) -> Logic:
        """タスク処理クラス作成
        Args:
            job (active): ジョブID
            logger (logging.Logger): ロガー
        Returns:
            Logic: タスク処理クラス
        """
        return await super().make_logic(job_id, logger)
