# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """PLC書込みタスク
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
        plc_address (abstract.value.Domain): PLCアドレス
        data (abstract.value.Domain): 書き込み内容
    """
    name:str = "PLC書込み"
    plc_address: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    data: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "equipment.plc.write",
            "tooltip": "PLCに指定した値を書き込む",
            "message0": "%1 %2 アドレス %3 書込み内容 %4",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "input_value",
                    "name": "plc_address",
                    "align": "RIGHT",
                    "check": "EquipmentPLC"
                },
                {
                    "type": "input_value",
                    "name": "data",
                    "align": "RIGHT",
                    "check": ["Boolean", "Number"]
                },
            ],
            "colour": 90,
            "previousStatement": None,
            "nextStatement": None,
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
            "type": "equipment.plc.write",
            "inputs": {
                "plc_address": {
                    "shadow": {
                        "type": "equipment.plc.get_address"
                    }
                },
                "data": {
                    "shadow": {
                        "type": "logic_boolean"
                    }
                }
            }
        }]
