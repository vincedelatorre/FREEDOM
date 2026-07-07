# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract, freedom


@dataclasses.dataclass
class Domain(abstract.database.Domain):
    """AuthZ(認可)設定
    Args:
        interface (str): インターフェース名
        dsn (str): DB接続先DSN
        schema (str): スキーマ名
        table (str): テーブル名
        update_cycle (float): 更新周期
    """
    schema: str = "authz"
    table: str = "casbin_rule"

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return super().make_form(freedom.authz.access)

    def __post_init__(self):
        """初期化後処理"""
        super().__post_init__(freedom.authz.access)
