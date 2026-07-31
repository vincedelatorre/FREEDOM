# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """dict_get_itemタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        DICT (abstract.value.Domain): 処理対象
        KEY (abstract.value.Domain): 索引
    """
    DICT: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    KEY: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "dict_get_item",
            "tooltip": "辞書から索引の値を取得します",
            "helpUrl": "",
            "message0": "%1 の索引 %2",
            "args0": [
                {
                    "type": "input_value",
                    "name": "DICT",
                    "check": "Dict"
                },
                {
                    "type": "input_value",
                    "name": "KEY",
                }
            ],
            "output": None,
            "inputsInline": True,
            'colour': 280
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
            "type": "dict_get_item",
            "inputs": {
                "DICT": {
                    "shadow": {
                        "type": "_dict_get"
                    }
                },
                "KEY": {
                    "shadow": {
                        "type": "text"
                    }
                }
            }
        }]
