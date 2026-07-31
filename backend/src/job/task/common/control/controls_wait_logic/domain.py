# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """条件待機タスク
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
        mode (typing.Literal["while", "until"]): 待機モード
        cond (abstract.value.Domain): 条件
        interval (abstract.value.Domain): 確認周期
    """
    name: str = "条件待機"
    mode: typing.Literal["while", "until"] = "while"
    cond: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    interval: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        カスタムブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "controls_wait_logic",
            "tooltip": "条件が揃うまでジョブを待機させる",
            "helpUrl": "",
            "message0": "%1 %2 %3 %4 確認周期 %5",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "field_dropdown",
                    "name": "mode",
                    "options": [
                        ["待機を続ける条件", "while"],
                        ["待機が終わる条件", "until"]
                    ]
                },
                {
                    "type": "input_value",
                    "align": "RIGHT",
                    "name": "cond",
                    "check": "Boolean"
                },
                {
                    "type": "input_value",
                    "align": "RIGHT",
                    "name": "interval",
                    "check": "TimeDelta"
                }
            ],
            "previousStatement": None,
            "nextStatement": None,
            "colour": 180
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
            "type": "controls_wait_logic",
            "inputs": {
                "cond": {
                    "shadow": {
                        "type": "_logic_get"
                    }
                },
                "interval": {
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
                            }
                        },
                        "fields": {
                            "unit": "seconds"
                        }
                    }
                }
            }
        }]
