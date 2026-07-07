# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.repository import repository
from src import freedom
from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """ダミー移動タスク
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
        robot (abstract.Domain): 対象ロボット
        latitude (abstract.Domain): 緯度
        longitude (abstract.Domain): 経度
        speed (abstract.Domain): 速度(km/s)
        stop (abstract.Domain): 停止条件
    """
    name: str = "ダミー移動"
    robot: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    latitude: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    longitude: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    meter: str = "1000"
    second: str = "3600"
    speed: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    stop: abstract.value.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "robot.dummy.move",
            "tooltip": "ダミーロボットを任意の座標に移動する",
            "helpUrl": "",
            "message0": "%1 %2 ロボット %3 緯度 %4 経度 %5 速度( %6 / %7 ) %8 停止条件 %9",
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
                    "name": "latitude",
                    "align": "RIGHT",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "longitude",
                    "align": "RIGHT",
                    "check": "Number"
                },
                {
                    "type": "field_dropdown",
                    "name": "meter",
                    "options": [
                        [ "km", "1000" ],
                        [ "m", "1" ],
                        [ "mm", "0.001" ]
                    ]
                },
                {
                    "type": "field_dropdown",
                    "name": "second",
                    "options": [
                        [ "h", "3600" ],
                        [ "m", "60" ],
                        [ "s", "1" ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "speed",
                    "align": "RIGHT",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "stop",
                    "align": "RIGHT",
                    "check": "Boolean"
                }
            ],
            "previousStatement": None,
            "nextStatement": None,
            "colour": 15,
        }]

    @classmethod
    def define_toolbox(cls) -> list[dict]:
        """ツールボックス定義
        フィールド値や出力ブロックの初期値を定義する
        https://developers.google.com/blockly/guides/configure/web/toolboxes/category?hl=ja
        Returns:
            list[dict]: ツールボックス定義
        """
        map = repository.retrieve(freedom.map.Node)[0]
        return [{
            "kind": "block",
            "type": "robot.dummy.move",
            "inputs": {
                "robot": {
                    "shadow": {
                        "type": "robot._get"
                    }
                },
                "latitude": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": map.domain.default_view.center[0]
                        }
                    }
                },
                "longitude": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": map.domain.default_view.center[1]
                        }
                    }
                },
                "speed": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 10
                        }
                    }
                }
            }
        }]
