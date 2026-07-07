# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import inspect

from src import abstract, infrastructure, util


@dataclasses.dataclass
class NodeDomain(infrastructure.Domain):
    """遮断機設備ノード設定
    Args:
        enable (bool): 有効
        name (str): 名前
        location (list[float]): 位置
        priority (int): 優先度
        interface (str): インターフェース
        ip (str): IPアドレス
        port (int): ポート番号
        read_address (int): 読込みアドレス
        open_state (bool): 通行可能な読込みアドレス状態
        timeout (float): 通信タイムアウト
        update_cycle (float): 更新周期
        area_list (list[util.map.Area]): 連携エリア
    """
    interface: str = "IoLogic"
    ip: str = "0.0.0.0"
    port: int = 80
    read_address: int = 0
    open_state: bool = False
    timeout: float = 1.0
    update_cycle: float = 1.0
    area_list: list[util.map.Area] = dataclasses.field(default_factory=list)

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form() | {
            "interface": {
                "type": "select",
                "label": "インターフェース",
                "items": {name: name for name, _ in inspect.getmembers(infrastructure.gate.access, inspect.isclass)},
            },
            "ip": {
                "type": "text",
                "label": "IPアドレス",
            },
            "port": {
                "type": "number",
                "label": "ポート番号",
                "integer": True,
                "min": 0,
            },
            "read_address": {
                "type": "number",
                "label": "読込みアドレス",
                "integer": True,
                "min": 0,
            },
            "open_state": {
                "type": "radio",
                "label": "通行可能な読込みアドレス状態",
                "items": {"0": False, "1": True},
            },
            "timeout": {
                "type": "number",
                "label": "通信タイムアウト",
                "suffix": "秒",
                "min": 0,
            },
            "update_cycle": {
                "type": "number",
                "label": "更新周期",
                "suffix": "秒",
                "min": 0,
            },
            "area_list": {
                "type": "area",
                "label": "連携エリア",
            },
        }

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__()
        self.area_list = [util.map.Area(**area) if isinstance(area, dict) else area for area in self.area_list]


@dataclasses.dataclass
class Domain(abstract.Domain):
    """遮断機設備設定
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
