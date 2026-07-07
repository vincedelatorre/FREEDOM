# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
from datetime import datetime

from src import abstract, freedom


@dataclasses.dataclass
class Column:
    """ログのカラム定義
    Args:
        time (datetime): ログの発生日時
        name (str): ログの名前
        levelname (str): ログレベル名
        message (str): ログメッセージ
    """
    time:datetime
    name:str
    levelname:str
    message:str


@dataclasses.dataclass
class Domain(abstract.database.Domain):
    """ログ設定
    Args:
        interface (str): インターフェース名
        dsn (str): DB接続先
        schema (str): スキーマ名
        table (str): テーブル名
        update_cycle (float): 更新周期
        retention_period (int): 保存期間（日単位）
    """
    table:str = "freedom_log"
    retention_period:int = 90

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form(freedom.log.access) | {
            "retention_period": {
                "type": "number",
                "label": "保存期間",
                "suffix": "日",
                "integer": True,
                "min": 1,
            }
        }

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__(freedom.log.access)
