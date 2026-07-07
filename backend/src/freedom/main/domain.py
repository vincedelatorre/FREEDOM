# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import typing

if typing.TYPE_CHECKING:
    import config.dummy


@dataclasses.dataclass
class Domain:
    """Freedom設定
    Args:
        interface (str): インターフェース名
        dsn (str): DB接続先
        schema (str): スキーマ名
        table (str): テーブル名
        update_cycle (float): 更新周期
    Note:
        conf (config.dummy): 初期化時設定
    """
    interface:str
    dsn:str
    schema:str
    table:str
    update_cycle:float

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        ここでは作成しない freedom.user_interface.logic.freedom.main.Configを参照
        """
        pass

    def __post_init__(self):
        """初期化後処理"""
        self.conf:config.dummy = None
