# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """text_getSubstringタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        STRING (abstract.value.Domain): 処理対象
        WHERE1 (str): 処理方法1
        WHERE2 (str): 処理方法2
        AT1 (abstract.value.Domain): 始点
        AT2 (abstract.value.Domain): 終点
    """
    STRING: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
    WHERE1: str = ""
    WHERE2: str = ""
    AT1: abstract.value.Domain = None
    AT2: abstract.value.Domain = None

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
            "type": "text_getSubstring",
            "inputs": {
                "STRING": {
                    "shadow": {
                        "type": "_text_get"
                    }
                }
            }
        }]
