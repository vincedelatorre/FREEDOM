# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job import command
from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """インフラ設備連携タスク
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
        robot (abstract.value.Domain): 連携ロボット
        exclude (abstract.value.Domain): 除外設備
        update_cycle (float): 更新周期
        warning_time (abstract.value.Domain): 許可待ち警告秒
        accept (dict[typing.Literal["id"], str]): 連携結果代入先
        task (abstract.statement.Domain): サブタスク
    """
    name: str = "インフラ設備連携"
    can_recover: bool = False
    robot: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    exclude: abstract.value.Domain = None
    update_cycle: float = 1.0
    warning_time: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    accept: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)
    task: abstract.statement.Domain = dataclasses.field(default_factory=abstract.statement.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "infrastructure.accept",
            "message0": "%1 %2 連携ロボット %3 除外設備 %4 更新周期 %5 秒 %6 許可待ち警告秒 %7 通行許可変数 %8 %9 %10",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "input_value",
                    "name": "robot",
                    "align": "RIGHT",
                    "check": "Robot"
                },
                {
                    "type": "input_value",
                    "name": "exclude",
                    "align": "RIGHT",
                    "check": ["Infrastructure", "Array"]
                },
                {
                    "type": "field_number",
                    "name": "update_cycle",
                    "value": cls.update_cycle,
                    "min": 0
                },
                {"type": "input_dummy", "align": "RIGHT"},
                {
                    "type": "input_value",
                    "name": "warning_time",
                    "align": "RIGHT",
                    "check": "Number"
                },
                {
                    "type": "field_variable",
                    "name": "accept",
                    "variable": "accept",
                    "variableTypes": ["Boolean"],
                    "defaultType": "Boolean"
                },
                {"type": "input_dummy", "align": "RIGHT"},
                {
                    "type": "input_statement",
                    "name": "task"
                }
            ],
            "previousStatement": None,
            "nextStatement": None,
            "colour": 60,
            "inputsInline": False,
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
            "type": "infrastructure.accept",
            "inputs": {
                "robot": {
                    "shadow": {
                        "type": "robot._get"
                    }
                },
                "warning_time": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 60
                        }
                    }
                }
            }
        }]
