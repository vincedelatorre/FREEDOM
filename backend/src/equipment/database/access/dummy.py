# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src.equipment.database import NodeDomain
from src.equipment.database.interface import Interface


class Dummy(Interface):
    """データベース ダミー接続
    Attributes:
        data (list[dict]): データ
    """
    def __init__(self, domain:NodeDomain):
        """インスタンス化
        Args:
            domain (NodeDomain): ドメイン
        """
        self.data:list[dict] = list()

    async def close(self):
        """切断"""
        pass

    async def is_connected(self) -> bool:
        """接続確認
        Returns:
            bool: 接続状態
        """
        return True

    async def upsert(self, keys:list[str], data:dict):
        """追加・更新
        Args:
            keys (list[str]): 一致キー
            data (dict): 書込み値
        """
        if keys:
            for i, d in enumerate(self.data):
                if all(d.get(k) == data.get(k) for k in keys):
                    self.data[i] = data
                    return
        self.data.append(data)
