# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """条件分岐タスク
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
        IF0 (abstract.value.Domain): 条件0
        DO0 (abstract.statement.Domain): 処理0
        IF1 (abstract.value.Domain): 条件1
        DO1 (abstract.statement.Domain): 処理1
        ...
        ELSE (abstract.statement.Domain): 処理
    """
    name: str = "条件分岐"

    def __new__(cls, type:str, id=str, name="条件分岐", next=None, should_show=True, can_recover=True, finished=False, command=list(), **kwargs):
        """インスタンス前処理
        追加分の入力を含めたdataclassを作成して返却
        Args:
            type (str): タスク種類
            id (str): タスクID
            name (str): タスク名
            next (Domain): 次タスク
            should_show (bool): 表示判定
            can_recover (bool): 復帰可能判定
            finished (bool): 終了フラグ
            command (list): コマンド内容
        Returns:
            Domain: 条件分岐タスク
        """
        fields = list()
        for k in kwargs.keys():
            if "IF" in k:
                fields.append((k, abstract.value.Domain, dataclasses.field(default_factory=abstract.value.Domain)))
            else:
                fields.append((k, abstract.statement.Domain, None))
        domain = dataclasses.make_dataclass("Domain", fields, bases=(abstract.statement.Domain,), namespace={
            'define_block': lambda cls: list(),
            'define_toolbox': lambda cls: list(),
        })
        return domain(type=type, id=id, name=name, next=next, should_show=should_show, can_recover=can_recover, finished=finished, command=command, **kwargs)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        カスタムブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        Note:
            タスク名のためデフォルトから変更
        """
        return [{
            'type': 'controls_if_custom',
            "message0": "%1 %2 タスク表示 %3",
            "args0": [
                {
                    "type": "field_input",
                    "name": "name",
                    "text": cls.name
                },
                {"type": "input_dummy"},
                {
                    "type": "field_checkbox",
                    "name": "should_show",
                    "checked": cls.should_show
                },
            ],
            'message1': '%{BKY_CONTROLS_IF_MSG_IF} %1',
            'args1': [
                {
                    'type': 'input_value',
                    'name': 'IF0',
                    'check': 'Boolean',
                },
            ],
            'message2': '%{BKY_CONTROLS_IF_MSG_THEN} %1',
            'args2': [
                {
                    'type': 'input_statement',
                    'name': 'DO0',
                },
            ],
            'previousStatement': None,
            'nextStatement': None,
            'style': 'logic_blocks',
            'helpUrl': '%{BKY_CONTROLS_IF_HELPURL}',
            'suppressPrefixSuffix': True,
            'mutator': 'controls_if_mutator',
            'extensions': ['controls_if_tooltip'],
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
            "type": "controls_if_custom"
        }]
