# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """text_joinタスク
    Args:
        type (str): タスク種類
        id (str): タスクID
        ADD0 (abstract.value.Domain): 要素0
        ADD1 (abstract.value.Domain): 要素1
        ADD2 (abstract.value.Domain): 要素2
        ...
    """

    def __new__(cls, type:str, id=str, **kwargs):
        """インスタンス前処理
        追加分の入力を含めたdataclassを作成して返却
        Args:
            type (str): タスク種類
            id (str): タスクID
            name (str): タスク名
            next (Domain): 次タスク
            can_recover (bool): 復帰可能判定
            finished (bool): 終了フラグ
            command (list): コマンド内容
        Returns:
            Domain: text_joinタスク
        """
        fields = list()
        for k in kwargs.keys():
            if k.startswith("ADD"):
                fields.append((k, abstract.value.Domain, dataclasses.field(default=None)))
        domain = dataclasses.make_dataclass("Domain", fields, bases=(abstract.value.Domain,), namespace={
            'define_block': lambda cls: list(),
            'define_toolbox': lambda cls: list(),
        })
        return domain(type=type, id=id, **kwargs)

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
            "type": "text_join"
        }]
