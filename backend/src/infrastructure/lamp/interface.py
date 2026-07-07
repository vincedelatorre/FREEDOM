# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.infrastructure.lamp import NodeDomain


class Interface(abc.ABC):
    @abc.abstractmethod
    def __init__(self, domain:NodeDomain):
        """ランプ接続インターフェース
        Args:
            domain (Domain): ドメイン
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def close(self):
        """切断"""
        raise NotImplementedError()

    @abc.abstractmethod
    async def read(self, address:int) -> bool:
        """読込み
        Args:
            address (int): アドレス
        Returns:
            bool: 読込み結果
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def write(self, address:int, data:bool):
        """書込み
        Args:
            address (int): アドレス
            data (bool): 書込み内容
        """
        raise NotImplementedError()
