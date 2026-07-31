# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src.job.task import abstract


@dataclasses.dataclass
class Domain(abstract.statement.Domain):
    """順次例外処理タスク
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
        init_task (abstract.statement.Domain): 開始時タスク
        try_task (abstract.statement.Domain): 実行タスク
        except_task (abstract.statement.Domain): 異常時タスク
        finally_task (abstract.statement.Domain): 終了時タスク
    """
    name:str = ""
    should_show:bool = False
    can_recover:bool = False
    init_task: abstract.statement.Domain = None
    try_task: abstract.statement.Domain = None
    except_task: abstract.statement.Domain = None
    finally_task: abstract.statement.Domain = None

    @classmethod
    def define_block(cls) -> list[dict]:
        """ブロック定義
        自作ブロックの形状を定義する
        https://developers.google.com/blockly/guides/create-custom-blocks/define/block-definitions?hl=ja
        Returns:
            list[dict]: ブロック定義
        """
        return [{
            "type": "controls_try",
            "message0": "開始時に実行 %1 タスク実行 %2 異常時に実行 %3 終了時に実行 %4",
            "args0": [
                {
                    "type": "input_statement",
                    "name": "init_task",
                    "align": "RIGHT"
                },
                {
                    "type": "input_statement",
                    "name": "try_task",
                    "align": "RIGHT"
                },
                {
                    "type": "input_statement",
                    "name": "except_task",
                    "align": "RIGHT"
                },
                {
                    "type": "input_statement",
                    "name": "finally_task",
                    "align": "RIGHT"
                }
            ],
            "previousStatement": None,
            "nextStatement": None,
            "colour": 180,
            "tooltip": "",
            "inputsInline": False,
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
            "type": "controls_try"
        }]
