# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc
import dataclasses

from src import abstract


@dataclasses.dataclass
class Domain(abstract.Domain, abc.ABC):
    """ロボット抽象ノード設定
    Args:
        enable (bool): 有効
        name (str): 名前
        update_cycle (float): 更新周期
    Note:
        location (list[float]): 位置
    """
    enable:bool = True
    name:str = ""
    update_cycle:float = 1.0

    def __post_init__(self):
        """初期化後処理"""
        self.location:list[float, float] = None

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
            "update_cycle": {
                "type": "number",
                "label": "更新周期",
                "suffix": "秒",
                "min": 0,
            },
        }
