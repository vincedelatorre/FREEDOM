# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """lists_getSublistタスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        WHERE1 (str):開始位置設定
        WHERE2 (str):終了位置設定
        LIST (abstract.value.Domain): 処理対象
        AT1 (abstract.value.Domain):開始位置
        AT2 (abstract.value.Domain):終了位置
    """
    WHERE1: str = ""
    WHERE2: str = ""
    LIST: abstract.value.Domain = dataclasses.field(default_factory=abstract.value.Domain)
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
            "type": "lists_getSublist",
            "inputs": {
                "LIST": {
                    "shadow": {
                        "type": "_list_get"
                    }
                }
            }
        }]
