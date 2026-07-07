# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """lists_repeatタスク
    Args:
        can_recover (bool): 復帰可否
        command (list[dict]): コマンド内容
        ITEM (abstract.value.Domain): 処理対象
        NUM (abstract.value.Domain): 繰り返し回数
    """
    ITEM: abstract.value.Domain = None
    NUM: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)

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
            "type": "lists_repeat",
            "inputs": {
                "NUM": {
                    "shadow": {
                        "type": "math_number",
                        "fields": {
                            "NUM": 5
                        }
                    }
                }
            }
        }]
