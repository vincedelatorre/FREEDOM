# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """インフラ設備連携タスク
    Attributes:
        type (str): タスク種類
        id (str): タスクID
        name (str): タスク名
            UIにタスク名として表示される内容
        next (Domain): 次タスク
        should_show (bool): 表示判定
            タスクをUIに表示するかどうか
        can_recover (bool): 復帰可能判定
            ジョブ停止時に復帰できる判定
        finished (bool): 終了フラグ
        command (list): コマンド内容
        robot (abstract.value.Domain): 連携ロボット
        exclude (abstract.value.Domain): 除外設備
        update_cycle (abstract.value.Domain): 更新周期
        warning_time (abstract.value.Domain): 許可待ち警告時間
        task (abstract.statement.Domain): サブタスク
    """
    name: str = "インフラ設備連携"
    should_show:bool = False
    can_recover:bool = False
    robot: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    exclude: abstract.value.Domain = None
    update_cycle: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    warning_time: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    task: abstract.statement.Domain = None

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
            "message1": "連携ロボット %1 除外設備 %2 更新周期 %3 許可待ち警告時間 %4 %5",
            "args1": [
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
                    "type": "input_value",
                    "name": "update_cycle",
                    "align": "RIGHT",
                    "check": "TimeDelta"
                },
                {
                    "type": "input_value",
                    "name": "warning_time",
                    "align": "RIGHT",
                    "check": "TimeDelta"
                },
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
                "update_cycle": {
                    "shadow": {
                        "type": "time_delta_duration",
                        "inputs": {
                            "time": {
                                "shadow": {
                                    "type": "math_number",
                                    "fields": {
                                        "NUM": 1
                                    }
                                }
                            },
                        },
                        "fields": {
                            "unit": "seconds",
                        }
                    }
                },
                "warning_time": {
                    "shadow": {
                        "type": "time_delta_duration",
                        "inputs": {
                            "time": {
                                "shadow": {
                                    "type": "math_number",
                                    "fields": {
                                        "NUM": 1
                                    }
                                }
                            },
                        },
                        "fields": {
                            "unit": "minutes",
                        }
                    }
                }
            }
        }]
