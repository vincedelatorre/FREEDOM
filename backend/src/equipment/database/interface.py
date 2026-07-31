# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.equipment.database import NodeDomain


class Interface(abc.ABC):
    """データベース インターフェース"""
    @abc.abstractmethod
    def __init__(self, domain:NodeDomain):
        """インスタンス化
        Args:
            domain (NodeDomain): ドメイン
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def close(self):
        """切断"""
        raise NotImplementedError()

    @abc.abstractmethod
    async def is_connected(self) -> bool:
        """接続確認
        Returns:
            bool: 接続状態
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def upsert(self, keys:list[str], data:dict):
        """追加・更新
        Args:
            keys (list[str]): 一致キー
            data (dict): 書込み値
        """
        raise NotImplementedError()
