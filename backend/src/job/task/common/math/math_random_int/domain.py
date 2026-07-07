# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """math_random_intタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        FROM (abstract.value.Domain): 範囲_開始
        TO (abstract.value.Domain): 範囲_終了
    """
    FROM: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    TO: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

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
            "type": "math_random_int",
            "inputs": {
                "FROM": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 1
                        }
                    }
                },
                "TO": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 100
                        }
                    }
                }
            }
        }]
