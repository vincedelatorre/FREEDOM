# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.job.active import Domain


class Interface(abc.ABC):
    @abc.abstractmethod
    def __init__(self, domain:Domain):
        """ジョブ実行DB接続インターフェース
        Args:
            domain (Domain): ドメイン
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def insert(self, name:str, task:dict, variables:list[dict]) -> dict:
        """実行ジョブ保存
        Args:
            name (str): ジョブ名
            task (dict): タスク内容
            variables (list[dict]): タスク変数
        Returns:
            dict: 実行ジョブ設定
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def fetch(self) -> list[dict]:
        """実行ジョブ取得
        Returns:
            list[dict]: 実行ジョブ設定
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def update(self, node_list:list[dict]):
        """実行ジョブ更新
        Args:
            node_list (list[dict]): 実行ジョブ設定リスト
        """
        raise NotImplementedError()
