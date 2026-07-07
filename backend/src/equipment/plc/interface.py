# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.equipment.plc import NodeDomain


class Interface(abc.ABC):
    """PLC インターフェース"""
    @abc.abstractmethod
    def __init__(self, domain:NodeDomain):
        """インスタンス化
        Args:
            domain (NodeDomain): ドメイン
        """
        raise NotImplementedError()

    async def close(self):
        """切断"""
        pass

    @abc.abstractmethod
    async def read_bit(self, address: str, bit: int) -> bool:
        """ビット読込み
        Args:
            address (str): アドレス
            bit (int): ビット
        Returns:
            bool: 読込み結果
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def write_bit(self, address: str, bit: int, data: bool):
        """ビット書込み
        Args:
            address (str): アドレス
            bit (int): ビット
            data (bool): 書込み内容
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def read_word(self, address: str) -> int:
        """ワード読込み
        Args:
            address (str): アドレス
        Returns:
            int: 読込み結果
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def write_word(self, address: str, data: int):
        """ワード書込み
        Args:
            address (str): アドレス
            data (int): 書込み内容
        """
        raise NotImplementedError()
