# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import datetime
import typing

from src import abstract, job


@dataclasses.dataclass
class Variable:
    """ジョブ変数
    Args:
        id (str): ブロックID
        name (str): 名前
        type (str): 型
        value (typing.Any): 内容
    """
    id: str
    name: str
    type: str = None
    value: typing.Any = None


@dataclasses.dataclass
class NodeDomain:
    """ジョブ実行ノード設定
    Args:
        id (int): 番号
        created_at (datetime.datetime): 生成日時
        name (str): 名前
        task (task.abstract.Domain): タスク内容
        variables (Variable): タスク変数
        command (Task): タスク実行管理
        error_msg (set): 異常メッセージ
        warning_msg (set): 警告メッセージ
    """
    id:int
    created_at:datetime.datetime
    name:str
    task:job.task.abstract.statement.Domain
    variables:list[Variable]
    command:job.command.Task = None
    error_msg:set = dataclasses.field(default_factory=set)
    warning_msg:set = dataclasses.field(default_factory=set)

    def __post_init__(self):
        """初期化後処理"""
        self.id = str(self.id)
        self.task = job.task.abstract.statement.Domain.to_domain(self.task)
        self.variables = [Variable(**v) for v in self.variables]
        if self.command is None:
            self.command = job.command.Task(id=self.task.id)
        elif type(self.command) is dict:
            self.command = job.command.Task(**self.command)
        self.error_msg = set(self.error_msg)
        self.warning_msg = set(self.warning_msg)


@dataclasses.dataclass
class Domain(abstract.database.Domain):
    """ジョブ実行設定
    Args:
        interface (str): インターフェース名
        dsn (str): DB接続先
        schema (str): スキーマ名
        table (str): テーブル名
        update_cycle (float): 更新周期
    """
    table:str = "job_active"

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form(job.active.access)

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__(job.active.access)
