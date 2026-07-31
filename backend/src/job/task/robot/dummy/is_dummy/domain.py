# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """ダミー判定タスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        robot (abstract.value.Domain): 入力ロボット
    """
    robot: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "robot.dummy.is_dummy",
            "tooltip": "入力ロボットがダミーかを判定します",
            "helpUrl": "",
            "message0": "%1 はダミー",
            "args0": [
                {
                    "type": "input_value",
                    "name": "robot",
                    "check": "Robot"
                },
            ],
            "output": "Boolean",
            "colour": 20
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
            "type": "robot.dummy.is_dummy",
            "inputs": {
                "robot": {
                    "shadow": {
                        "type": "robot._get"
                    }
                }
            }
        }]
