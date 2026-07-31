# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """ロボット選択タスク
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
        condition (abstract.value.Domain): 表示条件
    """
    name: str = "ロボット選択"
    VAR: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)
    condition: abstract.value.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "robot.select",
            "tooltip": "ロボット選択ボタンを表示する",
            "helpUrl": "",
            "message0": "%1 %2 %3 にセット %4 表示条件 %5",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "robot",
                    "variableTypes": ["Robot"],
                    "defaultType": "Robot"
                },
                {"type": "input_dummy", "align": "RIGHT"},
                {
                    "type": "input_value",
                    "name": "condition",
                    "align": "RIGHT",
                    "check": "Boolean"
                },
            ],
            "previousStatement": None,
            "nextStatement": None,
            "colour": 30
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
            "type": "robot.select"
        }]
