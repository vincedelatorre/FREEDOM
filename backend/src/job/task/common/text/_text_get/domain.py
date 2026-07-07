# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.value.Domain):
    """String変数取得タスク
    Args:
        type (str): ブロック種類
        id (str): ブロックID
        VAR (dict[typing.Literal["id"], str]): 取得先
    """
    VAR: dict[typing.Literal["id"], str] = dataclasses.field(default_factory=dict)

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "_text_get",
            "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
            "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
            "message0": "%1",
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "string",
                    "variableTypes": ["String"],
                    "defaultType": "String"
                }
            ],
            "output": "String",
            'style': 'text_blocks'
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
            "kind": "button",
            "text": "%{BKY_NEW_VARIABLE}",
            "callbackKey": "createVariable_String"
        },{
            "kind": "block",
            "type": "_text_get"
        }]
