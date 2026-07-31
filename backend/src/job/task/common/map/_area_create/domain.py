# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """エリア設定タスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        area_list (list[list[list[float]]]) エリアリスト
    """
    area_list:list[list[list[float]]] = dataclasses.field(default_factory=list)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "_area_create",
            "tooltip": "エリアを地図上で作成する。",
            "message0": "%1",
            "args0": [
                {
                    "type": "field_area",
                    "name": "area_list",
                    "value": []
                },
            ],
            "output": "Area",
            "colour": 140,
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
            "type": "_area_create",
        }]
