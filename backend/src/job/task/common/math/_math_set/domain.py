# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """math_setタスク
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
        VAR (dict[typing.Literal["id"], str]): 変数
        VALUE (abstract.value.Domain): 代入内容
    """
    name: str = "数字セット"
    VAR: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)
    VALUE: abstract.value.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "_math_set",
            'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
            'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
            'message0': '%1 %2',
            'args0': [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
            ],
            'message1': '%{BKY_VARIABLES_SET}',
            'args1': [
                {
                    'type': 'field_variable',
                    'name': 'VAR',
                    "variable": "number",
                    "variableTypes": ["Number"],
                    "defaultType": "Number"
                },
                {
                    'type': 'input_value',
                    'name': 'VALUE',
                    'check': 'Number',
                },
            ],
            "previousStatement": None,
            "nextStatement": None,
            'style': 'math_blocks'
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
            "type": "_math_set"
        }]
