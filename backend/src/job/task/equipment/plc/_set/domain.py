# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """EquipmentPLC変数セットタスク
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
        VAR (dict[typing.Literal["id"], str]): 変数
        VALUE (abstract.value.Domain): 代入内容
    """
    name: str = "アドレスセット"
    VAR: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)
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
            "type": "equipment.plc._set",
            'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
            'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
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
            'message1': '%{BKY_VARIABLES_SET}',
            'args1': [
                {
                    'type': 'field_variable',
                    'name': 'VAR',
                    "variable": "address",
                    "variableTypes": ["EquipmentPLC"],
                    "defaultType": "EquipmentPLC"
                },
                {
                    'type': 'input_value',
                    'name': 'VALUE',
                    'check': 'EquipmentPLC',
                },
            ],
            "previousStatement": None,
            "nextStatement": None,
            "inputsInline": True,
            "colour": 90,
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
            "type": "equipment.plc._set",
            "inputs": {
                "VALUE": {
                    "shadow": {
                        "type": "equipment.plc.get_address"
                    }
                }
            }
        }]
