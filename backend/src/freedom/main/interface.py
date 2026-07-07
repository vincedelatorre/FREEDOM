# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.freedom.main import Domain


class Interface(abc.ABC):
    @abc.abstractmethod
    def __init__(self, domain:Domain):
        """設定DB接続インターフェース
        Args:
            domain (Domain): ドメイン
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def fetch(self, node:str) -> dict:
        """設定取得
        無ければNoneを返す
        Args:
            node (str): ノード名
        Returns:
            dict: 設定
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def update(self, node:str, config:dict):
        """設定更新
        Args:
            node (str): ノード名
            config (dict): 設定
        """
        raise NotImplementedError()
