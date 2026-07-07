# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """PLC読込みタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        plc_address (abstract.value.Domain): PLCアドレス
    """
    plc_address: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "equipment.plc.read",
            "tooltip": "PLCアドレスの読込み結果を返す",
            "message0": "PLC読込み %1 アドレス %2",
            "args0": [
                {"type": "input_dummy"},
                {
                    "type": "input_value",
                    "name": "plc_address",
                    "align": "RIGHT",
                    "check": "EquipmentPLC"
                },
            ],
            "output": ["Boolean", "Number"],
            "colour": 90
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
            "type": "equipment.plc.read",
            "inputs": {
                "plc_address": {
                    "shadow": {
                        "type": "equipment.plc.get_address"
                    }
                }
            }
        }]
