# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """lists_getIndex_customタスク
    MODEがREMOVE時にステートメントブロックになるため定義変更
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        VALUE (abstract.value.Domain): 処理対象
        MODE (str): 処理方法
        WHERE (str): 始点
        AT (abstract.value.Domain): 始点からの要素数
    """
    VALUE: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    MODE: str = ""
    WHERE: str = ""
    AT: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "lists_getIndex_custom",
            "tooltip": "",
            "helpUrl": "%{BKY_LISTS_GET_INDEX_HELPURL}",
            "message0": "%{BKY_LISTS_GET_INDEX_INPUT_IN_LIST} %1 %2 %3 %4 %5 %6",
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Array"
                },
                {
                    "type": "field_dropdown",
                    "name": "MODE",
                    "options": [
                        ['%{BKY_LISTS_GET_INDEX_GET}', 'GET'],
                        ['%{BKY_LISTS_GET_INDEX_GET_REMOVE}', 'GET_REMOVE']
                    ]
                },
                {"type": "input_dummy"},
                {
                    "type": "field_dropdown",
                    "name": "WHERE",
                    "options": [
                        ['%{BKY_LISTS_GET_INDEX_FROM_START}', 'FROM_START'],
                        ['%{BKY_LISTS_GET_INDEX_FROM_END}', 'FROM_END']
                    ]
                },
                {"type": "input_dummy"},
                {
                    "type": "input_value",
                    "name": "AT",
                    "check": "Number"
                }
            ],
            "output": "Array",
            'style': 'list_blocks',
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
            "type": "lists_getIndex_custom",
            "inputs": {
                "VALUE": {
                    "shadow": {
                        "type": "_list_get"
                    }
                },
                "AT": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 1
                        }
                    }
                }
            }
        }]
