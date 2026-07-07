# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src import abstract, robot, util
from src.infrastructure import Domain


class Node(abstract.Node, abc.ABC):
    def __init__(self):
        """インフラ設備抽象ノード"""
        self.domain = Domain()

    @abc.abstractmethod
    def fetch_status(self) -> util.status.Status:
        """状態取得
        Returns:
            util.status.Status: 状態
        """
        raise NotImplementedError("Subclasses must implement fetch_status method")

    @abc.abstractmethod
    def fetch_command(self) -> list:
        """手動操作取得
        Returns:
            list: 操作内容
        """
        raise NotImplementedError("Subclasses must implement fetch_command method")

    @abc.abstractmethod
    async def accept(self, robot:robot.Node[robot.Domain]) -> bool:
        """連携許可
        Args:
            robot (robot.Node): ロボットノード
        """
        raise NotImplementedError("Subclasses must implement accept method")

    @abc.abstractmethod
    async def cancel(self, robot:robot.Node[robot.Domain]) -> bool:
        """連携終了
        Args:
            robot (robot.Node): ロボットノード
        """
        raise NotImplementedError("Subclasses must implement cancel method")
