# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """dict_create_withタスク ドメイン
    Args:
        type (str): タスク種類
        id (str): タスクID
        KEY0 (abstract.value.Domain): 索引0
        VALUE0 (abstract.value.Domain): 値0
        KEY1 (abstract.value.Domain): 索引1
        VALUE1 (abstract.value.Domain): 値1
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
            Domain: dict_create_withタスク ドメイン
        """
        fields = list()
        for k in kwargs.keys():
            if k.startswith("KEY"):
                fields.append((k, abstract.value.Domain, dataclasses.field(default=None)))
            if k.startswith("VALUE"):
                fields.append((k, abstract.value.Domain, dataclasses.field(default=None)))
        domain = dataclasses.make_dataclass("Domain", fields, bases=(abstract.value.Domain,), namespace={
            'define_block': lambda sub_cls: cls.define_block(),
            'define_toolbox': lambda sub_cls: cls.define_toolbox(),
        })
        return domain(type=type, id=id, **kwargs)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "dict_create_with",
            "tooltip": "辞書を作成します",
            'message0': '',
            'args0': [],
            "mutator": "dict_create_with_mutator",
            'output': 'Dict',
            'colour': 280,
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
            "type": "dict_create_with",
            "extraState": {
                "itemCount": 2
            }
        }]
