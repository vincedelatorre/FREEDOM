# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """エリア内判定タスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        location (abstract.Domain): 位置
        area_list (abstract.Domain) エリアリスト
    """
    location: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    area_list: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "_area_is_inside",
            "tooltip": "ロボットがエリア内にいるか判定する。",
            "message0": "%1 は %2 の内側",
            "args0": [
                {
                    "type": "input_value",
                    "name": "location",
                    "check": "Location"
                },
                {
                    "type": "input_value",
                    "name": "area_list",
                    "check": "Area",
                    "value": []
                },
            ],
            "output": "Boolean",
            "colour": 140,
            "inputsInline": True
        }]

    @classmethod
    def define_toolbox(cls) -> list[dict]:
        """ツールボックス定義
        フィールド値や出力ブロックの初期値を定義する
        https://developers.google.com/blockly/guides/configure/web/toolboxes/category?hl=ja
        Returns:
            list[dict]: ツールボックス定義
        """
        return [{
            "kind": "block",
            "type": "_area_is_inside",
            "inputs": {
                "location": {
                    "shadow": {
                        "type": "location_create"
                    }
                },
                "area_list": {
                    "shadow": {
                        "type": "_area_create"
                    }
                }
            }
        }]
