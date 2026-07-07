# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src import repository
from src.infrastructure.intersection import Node, Domain


class Repository(repository.Repository[Node]):
    def __init__(self, config:dict):
        """交差点リポジトリ
        Args:
            config (dict): 設定
        """
        if old := repository.repository.retrieve(self.__class__):
            self = old[0]
        else:
            super().__init__()
            repository.repository.append(self)
            self.domain = Domain()
        # 変更されたノードのみ再構築
        domain = Domain(**config)
        for node in self.data[:]:
            if node.domain in domain.node_domain:
                domain.node_domain.remove(node.domain)
            else:
                self.domain.node_domain.remove(node.domain)
                self.data.remove(node)
        self.domain.node_domain.extend(domain.node_domain)
        self.data.extend([Node(node) for node in domain.node_domain if node.enable])
