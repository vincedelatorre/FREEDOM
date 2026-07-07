# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc
import dataclasses
import importlib
import inspect
import logging
import typing

from src.job import task
from src.job.task.abstract.value import Logic


@dataclasses.dataclass
class Domain(abc.ABC):
    """抽象値タスクドメイン
    出力接続があるブロックはこれを継承する
    Args:
        type (str): ブロック種類
        id (str): ブロックID
    """
    type:str
    id:str

    def __post_init__(self):
        """初期化後処理
        Domain型のクラス変数があれば変換する
        """
        for field in dataclasses.fields(self):
            if not getattr(self, field.name):
                continue
            if field.name == "next" or inspect.isclass(field.type) and issubclass(field.type, Domain):
                setattr(self, field.name, Domain.to_domain(getattr(self, field.name)))

    @classmethod
    def to_domain(cls, content:dict) -> typing.Optional['Domain']:
        """タスクドメイン変換
        DB保存内容をドメインに変換する
        Args:
            contents (dict): DB保存内容
        Returns:
            Domain: タスクドメイン
        """
        for _, common in inspect.getmembers(task.common, inspect.ismodule):
            for name, module in inspect.getmembers(common, inspect.ismodule):
                if name == content["type"]:
                    return getattr(module, "Domain")(**content)
        module = importlib.import_module(f"src.job.task.{content["type"]}")
        return getattr(module, "Domain")(**content)

    async def make_logic(self, job_id:int, logger:logging.Logger) -> Logic:
        """タスク処理クラス作成
        Args:
            job (active): ジョブID
            logger (logging.Logger): ロガー
        Returns:
            Logic: タスク処理クラス
        """
        for _, common in inspect.getmembers(task.common, inspect.ismodule):
            for name, module in inspect.getmembers(common, inspect.ismodule):
                if name == self.type:
                    logic:Logic = getattr(module, "Logic")(self, job_id, logger)
                    await logic.init()
                    return logic
        module = importlib.import_module(f"src.job.task.{self.type}")
        logic:Logic = getattr(module, "Logic")(self, job_id, logger)
        await logic.init()
        return logic

    @classmethod
    @abc.abstractmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        カスタムブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        raise NotImplementedError("Subclasses must implement define_block method")

    @classmethod
    @abc.abstractmethod
    def define_toolbox(cls) -> list[dict]:
        """ツールボックス定義
        フィールド値や出力ブロックの初期値を定義する
        https://developers.google.com/blockly/guides/configure/web/toolboxes/category?hl=ja
        Returns:
            list[dict]: ツールボックス定義
        """
        raise NotImplementedError("Subclasses must implement define_block method")
