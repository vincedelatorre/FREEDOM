# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract, infrastructure, util


@dataclasses.dataclass
class ReserveArea(util.map.Area):
    """予約エリア設定
    Args:
        name (str): 名前
        vertex_list (list[list[float]]): 頂点リスト
            右または左回りにすること
        priority (int): 優先度
    """
    priority: int = 1


@dataclasses.dataclass
class IntersectionArea:
    """交差点エリア
    Args:
        entry_area (list[util.map.Area]): 進入エリア
        reserve_area (list[ReserveArea]): 予約エリア
    """
    entry_area: list[util.map.Area] = dataclasses.field(default_factory=list)
    reserve_area: list[ReserveArea] = dataclasses.field(default_factory=list)

    def __post_init__(self):
        """初期化後処理"""
        self.entry_area = [util.map.Area(**area) if isinstance(area, dict) else area for area in self.entry_area]
        self.reserve_area = [ReserveArea(**area) if isinstance(area, dict) else area for area in self.reserve_area]


@dataclasses.dataclass
class NodeDomain(infrastructure.Domain):
    """交差点ノード設定
    Args:
        enable (bool): 有効
        name (str): 名前
        location (list[float]): 位置
        priority (int): 優先度
        entry_num (int): 進入可能なロボット数
        area_list (IntersectionArea): 連携エリア
        update_cycle (float): 更新周期
    """
    entry_num: int = 1
    area_list: IntersectionArea = dataclasses.field(default_factory=IntersectionArea)
    update_cycle: float = 1.0

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form() | {
            "entry_num": {
                "type": "number",
                "label": "進入可能なロボット数",
                "min": 1,
            },
            "update_cycle": {
                "type": "number",
                "label": "更新周期",
                "suffix": "秒",
                "min": 0,
            },
            "area_list": {
                "type": "intersectionArea",
                "label": "連携エリア",
            },
        }

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__()
        if type(self.area_list) is dict:
            self.area_list = IntersectionArea(**self.area_list)


@dataclasses.dataclass
class Domain(abstract.Domain):
    """交差点設定
    Args:
        node_domain (list[NodeDomain]): ノード設定リスト
    """
    node_domain: list[NodeDomain] = dataclasses.field(default_factory=lambda: list())

    @classmethod
    def make_form(cls):
        """設定フォーム作成"""
        return {
            "node_domain": {
                "type": "node",
                "label": "ノード設定",
                "default": dataclasses.asdict(NodeDomain()),
                "forms": NodeDomain.make_form(),
                "unique": ["name"],
            }
        }

    def __post_init__(self):
        """初期化後処理"""
        self.node_domain = [NodeDomain(**node_domain) for node_domain in self.node_domain]
