# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract, robot


@dataclasses.dataclass
class NodeDomain(robot.Domain):
    """ダミーロボットノード設定
    Args:
        enable (bool): 有効
        name (str): 名前
        update_cycle (float): 更新周期
    Note:
        location (list[float]): 位置
    """
    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form()


@dataclasses.dataclass
class Domain(abstract.Domain):
    """ダミーロボット設定
    Args:
        node_domain (list[NodeDomain]): ノード設定リスト
    """
    node_domain:list[NodeDomain] = dataclasses.field(default_factory=lambda:list())

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return {
            "node_domain": {
                "type": "node",
                "label": "ノード設定",
                "default": dataclasses.asdict(NodeDomain()),
                "forms": NodeDomain.make_form(),
                "unique": ["name"]
            }
        }

    def __post_init__(self):
        """初期化後処理"""
        self.node_domain = [NodeDomain(**node_domain) for node_domain in self.node_domain]
