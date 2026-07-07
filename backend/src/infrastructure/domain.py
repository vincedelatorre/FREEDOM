# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc
import dataclasses

from src import abstract


@dataclasses.dataclass
class Domain(abstract.Domain, abc.ABC):
    """インフラ設備抽象ノード設定
    Args:
        enable (bool): 有効
        name (str): 名前
        location (list[float]): 位置
        priority (int): 優先度
    """
    enable:bool = True
    name:str = ""
    location:list[float, float] = dataclasses.field(default_factory=lambda:[0.0,0.0])
    priority:int = 0

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return {
            "enable": {
                "type": "switch",
                "label": "有効",
            },
            "name": {
                "type": "text",
                "label": "名前",
            },
            "location": {
                "type": "location",
                "label": "位置",
            },
            "priority": {
                "type": "number",
                "label": "優先度",
                "integer": True,
            },
        }
