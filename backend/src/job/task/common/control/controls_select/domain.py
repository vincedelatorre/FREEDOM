# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """ボタン選択タスク
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
        name (str): タスク名
        var (dict[typing.Literal["id"], str]): 代入先
        map (abstract.value.Domain): ボタンと代入内容の辞書
    """
    name: str = "ボタン選択"
    var: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)
    map: abstract.value.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        カスタムブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "controls_select",
            "tooltip": "押下したボタンに応じた内容を変数にセットする",
            "helpUrl": "",
            "message0": "%1 %2 %3 にセット %4 ボタン表示:選択内容 %5",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "field_variable",
                    "name": "var",
                    "variable": "select"
                },
                {"type": "input_dummy", "align": "RIGHT"},
                {
                    "type": "input_value",
                    "name": "map",
                    "align": "RIGHT",
                    "check": "Dict"
                },
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
            "type": "controls_select",
            "inputs": {
                "map": {
                    "shadow": {
                        "type": "_dict_get",
                    }
                }
            }
        }]
