# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract, job


@dataclasses.dataclass
class Column:
    """カラム定義
    Args:
        name (str): ジョブ名
        workspace (dict): Blockly環境
    """
    name:str
    workspace:dict


@dataclasses.dataclass
class Domain(abstract.database.Domain):
    """ジョブ作成設定
    Args:
        interface (str): インターフェース名
        dsn (str): DB接続先
        schema (str): スキーマ名
        table (str): テーブル名
        update_cycle (float): 更新周期
    """
    table:str = "job_create"

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form(job.create.access)

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__(job.create.access)
