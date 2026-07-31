# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """ドメイン取得タスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        robot (abstract.value.Domain): 入力ロボット
        config (str): 設定名
    """
    robot: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    config: str = ""

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "robot.get_domain",
            "tooltip": "ロボットの設定を取得する",
            "helpUrl": "",
            "message0": "%1 の %2",
            "args0": [
                {
                    "type": "input_value",
                    "name": "robot",
                    "check": "Robot"
                },
                {
                    "type": "field_dropdown",
                    "name": "config",
                    "options": [["名前", "name"], ["更新周期", "update_cycle"], ["位置", "location"]]
                }
            ],
            "output": None,
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
            "type": "robot.get_domain",
            "inputs": {
                "robot": {
                    "shadow": {
                        "type": "robot._get"
                    }
                }
            }
        }]
