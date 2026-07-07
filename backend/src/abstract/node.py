# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.abstract import Domain


class Node(abc.ABC):
    @abc.abstractmethod
    def __init__(self):
        """抽象ノード
        ドメインと各ノードの処理を管理するクラス
        ここで実装したメソッドはUIからのnodeリクエストで実行できる
        """
        self.domain = Domain()
