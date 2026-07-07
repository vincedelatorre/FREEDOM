# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """lists_setIndex_customタスク
    Args:
        type (str): タスク種類
        id (str): タスクID
        name (str): タスク名
            UIにタスク名として表示される内容
        next (Domain): 次タスク
        can_recover (bool): 復帰可能判定
            ジョブ停止時に復帰できる判定
        finished (bool): 終了フラグ
        command (list): コマンド内容
        LIST (abstract.value.Domain): 処理対象
        MODE (str): 処理方法
        WHERE (str): 始点
        AT (abstract.value.Domain): 始点からの要素数
        TO (abstract.value.Domain): 設定する値
    """
    name:str = "リスト変更"
    LIST: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    MODE: str = ""
    WHERE: str = ""
    AT: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    TO: abstract.value.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "lists_setIndex_custom",
            "tooltip": "",
            "helpUrl": "%{BKY_LISTS_SET_INDEX_HELPURL}",
            "message0": "%1 %2",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
            ],
            "message1": "%{BKY_LISTS_SET_INDEX_INPUT_IN_LIST} %1 %2 %3 %4 %5 %6 %{BKY_LISTS_SET_INDEX_INPUT_TO} %7",
            "args1": [
                {
                    "type": "input_value",
                    "name": "LIST",
                    "check": "Array"
                },
                {
                    "type": "field_dropdown",
                    "name": "MODE",
                    "options": [
                        ['%{BKY_LISTS_SET_INDEX_SET}', 'SET'],
                        ['%{BKY_LISTS_SET_INDEX_INSERT}', 'INSERT'],
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
                },
                {
                    "type": "input_value",
                    "name": "TO"
                }
            ],
            "previousStatement": None,
            "nextStatement": None,
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
            "type": "lists_setIndex_custom",
            "inputs": {
                "LIST": {
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
