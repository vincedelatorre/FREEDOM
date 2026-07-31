# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """dict_set_itemタスク
    Args:
        type (str): タスク種類
        id (str): タスクID
        name (str): タスク名
            UIにタスク名として表示される内容
        next (Domain): 次タスク
        should_show (bool): 表示判定
            ジョブ実行時に表示する判定
        can_recover (bool): 復帰可能判定
            ジョブ停止時に復帰できる判定
        finished (bool): 終了フラグ
        command (list): コマンド内容
        DICT (abstract.value.Domain): 変数
        KEY (abstract.value.Domain): 代入内容
        VALUE (abstract.value.Domain): 代入内容
    """
    name: str = "辞書変更"
    DICT: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    KEY: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    VALUE: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "dict_set_item",
            'tooltip': '辞書に値をセットします',
            "message0": "%1 %2 タスク表示 %3",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "field_checkbox",
                    "name": "should_show",
                    "checked": cls.should_show
                },
            ],
            'message1': '辞書 %1 索引 %2 に値 %3 をセット ',
            'args1': [
                {
                    'type': 'input_value',
                    'name': 'DICT',
                    "check": "Dict"
                },
                {
                    'type': 'input_value',
                    'name': 'KEY',
                },
                {
                    'type': 'input_value',
                    'name': 'VALUE',
                },
            ],
            "previousStatement": None,
            "nextStatement": None,
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
            "type": "dict_set_item",
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
                },
            }
        }]
