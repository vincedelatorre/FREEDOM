# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """math_constrainタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        VALUE (abstract.value.Domain): 対象値
        LOW (abstract.value.Domain): 下限値
        HIGH (abstract.value.Domain): 上限値
    """
    VALUE: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    LOW: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    HIGH: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        Note:
            デフォルトで定義済み
        """
        return []

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
            "type": "math_constrain",
            "inputs": {
                "VALUE": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 50
                        }
                    }
                },
                "LOW": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 1
                        }
                    }
                },
                "HIGH": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 100
                        }
                    }
                }
            }
        }]
